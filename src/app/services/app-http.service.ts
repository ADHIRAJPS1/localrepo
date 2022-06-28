import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './config';
import { Events } from '../shared/app-events';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppHttp {
  constructor(
    public config: Config,
    private http: HttpClient,
    public events: Events,
    public router: Router
  ) {}

  /**
   * Send XHR to specified URL with data
   * @param method - GET, PUT, POST etc.
   * @param url - Full url to acccess
   * @param data - Payload to send (if not a string, it is coverted to JSON)
   * @param headers - Object containing any headers to be sent
   * @param anonymous - is anonymous [without auth token]? (default- false)
   * @return Observable
   */
  public sendRequest(
    method: string,
    url: string,
    data: any = '',
    headers: any = {},
    anonymous: boolean = false
  ) {
    if (anonymous) {
      return this.processRequest(method, headers, url, data, anonymous);
    }

    if (
      this.config.tokens.auth.length > 0 &&
      this.isValidToken(this.config.tokens.auth)
    ) {
      return this.processRequest(method, headers, url, data, anonymous);
    } else {
      return this.refreshAuthenticationToken().then(
        (res) => {
          // retry with new token
          return this.processRequest(method, headers, url, data, anonymous);
        },
        (err) => {
          this.events.publish('refreshFail', {});
        }
      );
    }
  }

  private refreshAuthenticationToken(): Promise<any> {
    let url = `${this.config.baseUri}/user/refresh/v1`;
    let tokens = this.config.tokens;
    let headers = new HttpHeaders({
      Authorization: `Bearer ${tokens.refresh}`,
      'Content-Type': 'application/json',
    });
    let options = { headers: headers };

    return new Promise((resolve, reject) => {
      if (tokens.refresh === '') {
        reject({ title: '', detail: 'unauthorized access or no user' });
      } else {
        this.http.get(url, options).subscribe(
          (body: any) => {
            if (
              body.data !== undefined &&
              body.data[0].attributes !== undefined
            ) {
              //set new token to current user
              this.config.tokens.auth = body.data[0].attributes.token;
              this.config.tokens.refresh = body.data[0].attributes.refreshtoken;

              this.events.publish('tokenChanged', this.config.tokens);
              resolve(this.config.tokens);
            } else {
              this.router.navigate(['/login']);
              reject({ title: '', detail: 'error refreshing auth token' });
            }
          },
          (err) => {
            this.router.navigate(['/login']);
            reject({});
          }
        );
      }
    });
  }

  private isValidToken(token: string) {
    if (token == undefined) {
      return false;
    } else {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace('-', '+').replace('_', '/');
      let tokenObj = JSON.parse(window.atob(base64));

      //get time difference between tokenExp and current time
      let lifeTimeInPercentage =
        (new Date().getTime() / 1000 - tokenObj.iat.valueOf()) /
        (tokenObj.exp.valueOf() - tokenObj.iat.valueOf());

      if (lifeTimeInPercentage * 100 > 95) {
        return false;
      }

      return true;
    }
  }

  private processRequest(
    method: string,
    headers: any,
    url: string,
    data: any,
    anonymous: boolean
  ): Promise<any> {
    let req: any;

    return new Promise((resolve, reject) => {
      if (typeof method !== 'string') {
        reject({
          title: '',
          detail: 'app.http: sendRequest failed: METHOD not specified',
        });
      }

      method = method.toUpperCase();

      if (typeof url !== 'string') {
        reject({
          title: '',
          detail: 'app.http: sendRequest failed: URL not specified',
        });
      }

      /* headers and data can be empty but provide defaults */
      headers = headers || {};

      if (typeof data === 'string') {
        data = data || '';
      } else {
        data = JSON.stringify(data);
      }

      req = new XMLHttpRequest();
      req.open(method, url, true);

      //* set any requested headers by iterating the headers object */
      for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
          req.setRequestHeader(key, headers[key]);
        }
      }

      //adding Bearer tokens.
      req.setRequestHeader('Content-Type', 'application/json');

      if (anonymous) {
        if (headers.Authorization) {
          //do not insert another Authorization header. it will conflict
        } else {
          req.setRequestHeader('Authorization', this.config.apiKey);
        }
      } else {
        if (this.config.tokens.auth.length > 0) {
          req.setRequestHeader(
            'Authorization',
            `Bearer ${this.config.tokens.auth}`
          );
        } else {
          reject({ title: '', detail: 'unauthorized access or no user' });
        }
      }

      req.onload = () => {
        resolve(req);
      };

      /* set up onerror handler */
      req.onerror = () => {
        reject(req);
      };

      req.send(data);
    });
  }
}
