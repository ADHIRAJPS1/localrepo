import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Events } from '../shared/app-events';
import { AppHttp } from './app-http.service';
import { Config } from './config';

export class User {
  userId: string;
  authToken: string;
  refreshToken: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  postalcode: string;
  profilePic: string;
  roles: Array<string> = [];
  designation: string;
  orgId: string;
  jwtid: string;

  constructor(
    userId: string,
    authToken: string,
    refreshToken: string,
    jwtid: string,
    email: string,
    firstname: string,
    middlename: string,
    lastname: string,
    phoneNumber: string,
    gender: string,
    profilePic: string,
    roles: Array<string>
  ) {
    this.userId = userId;
    this.authToken = authToken;
    this.refreshToken = refreshToken;
    this.jwtid = jwtid;
    this.email = email;
    this.firstName = firstname;
    this.middleName = middlename;
    this.lastName = lastname;
    this.phoneNumber = phoneNumber;
    this.gender = gender;
    this.profilePic = profilePic;
    this.roles = roles;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AppAuth {
  public currentUser: User;
  public usrDetails: any = {};
  public firstTimeLoading: boolean = true;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  constructor(
    public config: Config,
    private http: AppHttp,
    public events: Events
  ) {
    this.usrDetails = this.currentUser;
  }

  loginChk(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.currentUser && this.currentUser.authToken) {
        resolve(true);
      } else if (this.firstTimeLoading) {
        this.initializeUser().then((res: boolean) => {
          resolve(res);
        });
      } else {
        resolve(false);
      }
    });
  }

  initializeUser() {
    return this.loadStoredUser()
      .then((res) => {
        if (res !== undefined) {
          return this.preloadAppData();
        } else {
          return;
        }
      })
      .then((res) => {
        if (this.currentUser && this.currentUser.authToken) {
          return true;
        } else {
          return false;
        }
      });
  }

  /**
   * JSON parser for the class
   * @param str A valid JSON string
   * @returns Object, if str is parsable, otherwise the same string is returned
   */
  private parseJson(str) {
    let data;

    try {
      data = JSON.parse(str);
    } catch (e) {
      data = str;
    }

    return data;
  }

  /**
   * Handler for returning a valid error object
   * @param res JSON response returned by web service
   * @returns Object { "title": "Something", "detail": "some detail" };
   */
  private commonErrorHandler(res) {
    if (res.errors && res.errors.length > 0) {
      // See of there are errors returned by server
      return res.errors[0];
    } else {
      // Else return a generic error object as per config
      return this.config.defaultError;
    }
  }

  /**
   * Saves updated tokens to localStorage
   * @param tokens updated tokens object with auth and refresh tokens
   */
  public updateTokens = (tokens) => {
    this.currentUser.authToken = tokens.auth;
    this.currentUser.refreshToken = tokens.refresh;
    this.currentUser.jwtid = tokens.jwtid;

    localStorage.setItem(
      `user_${this.config.application}`,
      JSON.stringify(this.currentUser)
    );
  };

  /**
   * Loads user contexts from localStorage
   * @returns current user if any, or undefined
   */
  public loadStoredUser(): Promise<User | any> {
    return new Promise((resolve) => {
      let u = localStorage.getItem(`user_${this.config.application}`);

      if (u && u.length > 0) {
        let user = JSON.parse(u);
        this.currentUser = new User(
          user.userId,
          user.authToken,
          user.refreshToken,
          user.email,
          user.jwtid,
          user.firstName,
          user.middleName,
          user.lastName,
          user.phoneNumber,
          user.gender,
          user.profilePic,
          user.roles
        );
        this.config.tokens.auth = user.authToken;
        this.config.tokens.refresh = user.refreshToken;
        this.currentUser.dob = user.dob;
        this.currentUser.profilePic = user.profilePic;
        this.currentUser.designation = user.designation;
        this.config.tokens.jwtid = user.jwtid;

        this.isAuthenticated.next(true); // no, not here
        // this.setProfilePic(user.profilePic);

        resolve(this.currentUser);
      } else {
        this.isAuthenticated.next(false);
        resolve(undefined);
      }
    });
  }

  /**
   * Register a user to the application
   * @param data Contact form data object
   * @returns Promise with success or error response
   */
  public register(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/user/register/v1`;
      //console.log(url);
      let auth: boolean =
        this.currentUser && this.currentUser.userId ? false : true;
      //console.log(data);
      this.http.sendRequest('post', url, data, {}, auth).then(
        (data) => {
          if (data.status == 401) {
            let err = {
              title: 'Unauthorised Access Detected!',
              detail: 'Please login first.',
            };
            reject(err);
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.message
            ) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Trigger forgot password email to user
   * @param email - email of the user
   * @returns
   */
  public forgotPassword(email) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/user/password/forgot/v1`;
      let data = { email: email };
      this.http.sendRequest('POST', url, data, {}, true).then(
        (data) => {
          if (data.status == 401) {
            let err = {
              title: 'Unauthorised Access Detected!',
              detail: 'Please login first.',
            };
            reject(err);
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.message
            ) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Change Password
   * @param data object with userid, newpassword and confirmpassword
   * @returns Promise
   */
  public ChangePassword(data) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/user/password/change/v1`;
      this.http.sendRequest('PUT', url, data, {}, true).then(
        (data) => {
          if (data.status == 401) {
            let err = {
              title: 'Unauthorised Access Detected!',
              detail: 'Please login first.',
            };
            reject(err);
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.message
            ) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Reset user password
   * @param data object with userid, newpassword and confirmpassword
   * @returns Promise
   */
  public resetPassword(data) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/user/password/change/v1`;
      this.http.sendRequest('PUT', url, data, {}, true).then(
        (data) => {
          if (data.status == 401) {
            let err = {
              title: 'Unauthorised Access Detected!',
              detail: 'Please login first.',
            };
            reject(err);
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.message
            ) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Verify email for password reset
   * @param data
   * @returns
   */
  public emailverify(data) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/user/emailverify/v1`;
      this.http.sendRequest('POST', url, data, {}, true).then(
        (data) => {
          if (data.status == 401) {
            let err = {
              title: 'Unauthorised Access Detected!',
              detail: 'Please login first.',
            };
            reject(err);
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.userid
            ) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Login a user to the application
   * @param username
   * @param password
   * @returns Promise with the current user object
   */
  public login(username: string, password: string): Promise<any> {
    let headers = {
      Authorization: 'Basic ' + window.btoa(username + ':' + password),
    };
    let url = `${this.config.baseUri}/user/login/v1`;

    return new Promise((resolve, reject) => {
      this.http.sendRequest('post', url, {}, headers, true).then(
        (data) => {
          let res = this.parseJson(data.response);

          if (
            res &&
            res.data &&
            res.data[0] &&
            res.data[0].attributes &&
            res.data[0].attributes.userid
          ) {
            this.config.tokens.auth = res.data[0].attributes.token;
            this.config.tokens.refresh = res.data[0].attributes.refreshtoken;
            this.config.tokens.jwtid = res.data[0].attributes.jwtid;
            console.log(this.config.tokens.jwtid);
            this.loadUserFromAPI(
              res.data[0].attributes.userid,
              res.data[0].attributes.roles
            )
              .then((u) => {
                resolve(this.currentUser);
                this.isAuthenticated.next(true);
              })
              .catch((err) => {
                reject({ title: '', detail: 'Error fetching user details!' });
              });
          } else {
            this.currentUser = undefined;
            let errObj = this.commonErrorHandler(res);
            reject(errObj);
          }
        },
        (err) => {
          this.currentUser = undefined;
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Fetch details of a user
   * @param userid ID of the user
   * @returns Promise with the user object
   */
  public loadUserFromAPI(userid, roles = []) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/user/details/v1?userid=${userid}`;

      this.http.sendRequest('get', url).then(
        (data) => {
          if (data && data.status == 200) {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.user
            ) {
              let u = res.data[0].attributes.user;

              this.currentUser = new User(
                userid,
                this.config.tokens.auth,
                this.config.tokens.refresh,
                this.config.tokens.jwtid,

                u.email,
                u.firstname,
                u.middlename,
                u.lastname,
                u.phonenumber,
                u.gender,
                u.profilePic,
                roles
              );

              //Other properties
              this.currentUser.address1 = u.address1;
              this.currentUser.address2 = u.address2;
              this.currentUser.city = u.city;
              this.currentUser.state = u.state;
              this.currentUser.country = u.country;
              this.currentUser.postalcode = u.postalcode;
              this.currentUser.dob = u.dob;
              this.currentUser.profilePic = u.profilePic;
              this.currentUser.designation = u.designation;
              this.currentUser.orgId = u.orgid;

              let cuStr = JSON.stringify(this.currentUser);
              localStorage.setItem(`user_${this.config.application}`, cuStr);

              resolve(this.currentUser);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          } else {
            this.triggerAuthFail();
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Broadcasts app-event for user-logout
   */
  private triggerAuthFail(): void {
    this.events.publish('user:logout', true);
  }

  /**
   * Logout existing user
   * @returns void
   */
  public logout(): Promise<any> {
    this.config.tokens.auth = '';
    this.config.tokens.refresh = '';
    localStorage.removeItem(`user_${this.config.application}`);
    this.currentUser = undefined;
    this.isAuthenticated.next(false);

    return Promise.resolve();
  }

  /**
   * Preload application data for initialisation
   * @returns Promise
   */
  public preloadAppData(): Promise<any> {
    return this.loadUserFromAPI(this.currentUser.userId, this.currentUser.roles)
      .then((res) => {
        let promises: Array<Promise<any>> = [
          // call any promise based functions here
        ];
        return Promise.all(promises);
      })
      .then((res) => {
        this.firstTimeLoading = false;
        this.isAuthenticated.next(true);
        return res;
      })
      .catch((err) => {
        this.firstTimeLoading = false;
        this.isAuthenticated.next(true);
      });
  }

  /**
   * Get list of Referred
   * @returns
   */
  public getReferredList(op: any, header: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/referred/v1`;
      if (op && Object.keys(op).length > 0) {
        let keys = Object.keys(op);
        let i = 1;
        keys.forEach((k) => {
          if (k && op[k]) {
            if (i == 1) {
              url = url + '?' + k + '=' + op[k];
            } else {
              url = url + '&' + k + '=' + op[k];
            }
            i++;
          }
        });
      }
      this.http.sendRequest('get', url).then(
        (data) => {
          let res = this.parseJson(data.response);
          if (
            res.data &&
            res.data[0] &&
            res.data[0].attributes &&
            res.data[0].attributes.storyreferred
          ) {
            resolve(res.data[0].attributes.storyreferred);
          } else {
            let errObj = this.commonErrorHandler(res);
            reject(errObj);
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Get list of Volunteer
   * @param filter filter value
   * @returns
   */
  public getVolunteerList(limit?, pageno?, search?, status?, orgid?) {
    return new Promise((resolve, reject) => {
      let queryParams = '';
      if (limit && limit != null && limit != undefined) {
        queryParams = queryParams + 'limit=' + limit;
      }
      if (pageno && pageno != null && pageno != undefined) {
        queryParams = queryParams + '&pageno=' + pageno;
      }
      if (search && search != null && search != undefined) {
        queryParams = queryParams + '&search=' + search;
      }
      if (status && status != null && status != undefined) {
        queryParams = queryParams + '&status=' + status;
      }
      if (orgid && orgid != null && orgid != undefined) {
        queryParams = queryParams + '&orgid=' + orgid;
      }
      let url = `${this.config.baseUri}/user/volunteerlist/v1?${queryParams}`;
      this.http.sendRequest('get', url).then(
        (data) => {
          let res = this.parseJson(data.response);

          if (
            res.data &&
            res.data[0] &&
            res.data[0].attributes &&
            res.data[0].attributes.volunteer
          ) {
            resolve(res.data[0].attributes.volunteer);
          } else {
            let errObj = this.commonErrorHandler(res);
            reject(errObj);
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Get list of employees by filter
   * @param filter filter value
   * @returns
   */
  public getEmpList(filter = 'all') {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/employee/list/v1?filter=${filter}`;

      this.http.sendRequest('get', url).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.list
            ) {
              resolve(res.data[0].attributes.list);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Get list of all the roles possible
   * @param filter filter value
   * @returns
   */
  public getAllRoles(filter = 'all') {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/roles/v1`;

      this.http.sendRequest('get', url).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.role
            ) {
              resolve(res.data[0].attributes.role);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Update user information
   * @param user user object
   * @returns
   */
  public updateUser(user) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/user/update/v1`;

      this.http.sendRequest('PUT', url, user).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Get list of all the categories possible for blog
   * @returns
   */
  public getBlogCategories() {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/blogs/categories/v1`;

      this.http.sendRequest('get', url).then(
        (data) => {
          if (data && data.status == 200) {
            let res = this.parseJson(data.response);
            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.list
            ) {
              resolve(res.data[0].attributes.list);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          } else {
            this.triggerAuthFail();
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Get blogs with desired filters, if any
   */
  public getBlogs(op: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/blogs/list/v1`;
      if (op && Object.keys(op).length > 0) {
        if (op.cslug && op.cslug == 'Category') {
          op.cslug = '';
        }
        let keys = Object.keys(op);
        let i = 1;
        keys.forEach((k) => {
          if (k && op[k]) {
            if (i == 1) {
              url = url + '?' + k + '=' + op[k];
            } else {
              url = url + '&' + k + '=' + op[k];
            }
            i++;
          }
        });
      }

      this.http.sendRequest('get', url).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.blogs
            ) {
              if (res.data[0].attributes.blogs.data) {
                // this happens when no data is there, problem in API
                res.data[0].attributes.blogs['list'] = [];
                delete res.data[0].attributes.blogs.data;
              }
              resolve(res.data[0].attributes.blogs);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  public getBlogStatusCount() {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/blogs/list/statuscount/v1`;

      this.http.sendRequest('get', url).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.blog
            ) {
              resolve(res.data[0].attributes.blog);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Create blog
   * @param blog blog object
   * @returns
   */
  public addBlog(blog) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/blogs/v1`;

      this.http.sendRequest('POST', url, blog).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Update Status
   * @param status object
   * @returns
   */
  public updateReferredStatus(status: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/referred/v1`;

      this.http.sendRequest('PUT', url, status).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Update blog information
   * @param blog blog object
   * @returns
   */
  public updateBlog(blog: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/blogs/v1`;

      this.http.sendRequest('PUT', url, blog).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Upload media for blog
   * @param bid blog ID
   * @param filename name of the file
   * @param base64code file in base64 format
   * @returns
   */
  public uploadMediaBlog(bid: any, filename: any, base64code: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/blogs/media/v1`;
      let param = {
        bid: bid,
        filename: filename,
        base64code: base64code,
      };

      this.http.sendRequest('POST', url, param).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Get list of all the categories possible for stories
   * @returns
   */
  public getStoryCategories() {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/categories/v1`;
      let isAnon = this.currentUser && this.currentUser.userId ? false : true;
      this.http.sendRequest('get', url, {}, {}, isAnon).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.categories
            ) {
              resolve(res.data[0].attributes.categories);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Get stories with desired filters, if any
   * @param limit number of items per page
   * @param page page number for pagination
   * @param keyword search term for story
   * @param cslug search term for searching in slug of the stories
   * @returns Promise with story object
   */
  public getStories(limit = 10, page = 1, keyword = '', cslug = '') {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/list/v1?limit=${limit}&pageno=${page}`;

      if (cslug && cslug.length > 0) {
        url += '&cslug=' + cslug;
      }

      if (keyword && keyword.length > 0) {
        url += '&search=' + keyword;
      }

      this.http.sendRequest('get', url).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.story
            ) {
              if (res.data[0].attributes.story.data) {
                // this happens when no data is there, problem in API
                res.data[0].attributes.story['list'] = [];
                delete res.data[0].attributes.story.data;
              }
              resolve(res.data[0].attributes.story);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Get getlistByUser
   * @param filter filter value
   * @returns
   */
  public getlistByUser(
    limit: any,
    pageno: any,
    search: any,
    userId: any,
    categoryname: any
  ) {
    return new Promise((resolve, reject) => {
      let queryParams = '';
      if (limit && limit != null && limit != undefined) {
        queryParams = queryParams + 'limit=' + limit;
      }
      if (pageno && pageno != null && pageno != undefined) {
        queryParams = queryParams + '&pageno=' + pageno;
      }
      if (search && search != null && search != undefined) {
        queryParams = queryParams + '&search=' + search;
      }
      if (userId && userId != null && userId != undefined) {
        queryParams = queryParams + '&userid=' + userId;
      }
      if (categoryname && categoryname != null && categoryname != undefined) {
        queryParams = queryParams + '&orgid=' + categoryname;
      }
      let url = `${this.config.baseUri}/stories/listByUser/v1?userid=${userId}`;
      this.http.sendRequest('get', url).then(
        (data) => {
          let res = this.parseJson(data.response);

          if (
            res.data &&
            res.data[0] &&
            res.data[0].attributes &&
            res.data[0].attributes.news
          ) {
            resolve(res.data[0].attributes.news);
          } else {
            let errObj = this.commonErrorHandler(res);
            reject(errObj);
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Get list of News
   * @param filter filter value
   * @returns
   */
  public getNewsList(limit?, pageno?, search?, status?, categoryname?) {
    return new Promise((resolve, reject) => {
      let queryParams = '';
      if (limit && limit != null && limit != undefined) {
        queryParams = queryParams + 'limit=' + limit;
      }
      if (pageno && pageno != null && pageno != undefined) {
        queryParams = queryParams + '&pageno=' + pageno;
      }
      if (search && search != null && search != undefined) {
        queryParams = queryParams + '&search=' + search;
      }
      if (status && status != null && status != undefined) {
        queryParams = queryParams + '&status=' + status;
      }
      if (categoryname && categoryname != null && categoryname != undefined) {
        queryParams = queryParams + '&orgid=' + categoryname;
      }
      let url = `${this.config.baseUri}/news/list/v1?${queryParams}`;
      this.http.sendRequest('get', url).then(
        (data) => {
          let res = this.parseJson(data.response);

          if (
            res.data &&
            res.data[0] &&
            res.data[0].attributes &&
            res.data[0].attributes.news
          ) {
            resolve(res.data[0].attributes.news);
          } else {
            let errObj = this.commonErrorHandler(res);
            reject(errObj);
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Create News
   * @param news news object
   * @returns
   */
  public addNews(news: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/news/v1`;

      this.http.sendRequest('POST', url, news).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Update News information
   * @param news  object
   * @returns
   */
  public updateNews(news: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/news/v1`;
      this.http.sendRequest('PUT', url, news).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Get stories with desired filters, if any
   * @param limit number of items per page
   * @param page page number for pagination
   * @param keyword search term for story
   * @param cslug search term for searching in slug of the stories
   * @returns Promise with story object
   */
  public getStoriesByStatus(limit = 10, page = 1, status = '') {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/list/v1?limit=${limit}&pageno=${page}&status=${status}`;
      this.http.sendRequest('get', url).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.story
            ) {
              if (res.data[0].attributes.story.data) {
                // this happens when no data is there, problem in API
                res.data[0].attributes.story['list'] = [];
                delete res.data[0].attributes.story.data;
              }
              resolve(res.data[0].attributes.story);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  public getStoriesStatusCount() {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/list/statuscount/v1`;
      this.http.sendRequest('get', url).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.story
            ) {
              if (res.data[0].attributes.story.data) {
                // this happens when no data is there, problem in API
                res.data[0].attributes.story['list'] = [];
                delete res.data[0].attributes.story.data;
              }
              resolve(res.data[0].attributes.story);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Get stories with desired filters, if any
   * @param limit number of items per page
   * @param page page number for pagination
   * @param keyword search term for story
   * @param cslug search term for searching in slug of the stories
   * @returns Promise with story object
   */
  public getStoriesByCatId(limit = 10, page = 1, categoryid = '') {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/list/v1?limit=${limit}&pageno=${page}&categoryid=${categoryid}`;
      this.http.sendRequest('get', url).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.story
            ) {
              if (res.data[0].attributes.story.data) {
                // this happens when no data is there, problem in API
                res.data[0].attributes.story['list'] = [];
                delete res.data[0].attributes.story.data;
              }
              resolve(res.data[0].attributes.story);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Create story
   * @param story story object
   * @returns
   */
  public addStory(story: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/v1`;

      this.http.sendRequest('POST', url, story).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Update story By stid information
   * @param stid object
   * @returns
   */
  public updateStoryByStid(stid: any, story: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/v1/${stid}`;
      this.http.sendRequest('PUT', url, story).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Update story By stid information
   * @param stid object
   * @returns
   */
  public updateStoryByStidWithout(story: any, headers: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/v1`;
      this.http.sendRequest('PUT', url, story, {}, false).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Update story information
   * @param story blog object
   * @returns
   */
  public updateStory(story: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/v1`;

      this.http.sendRequest('PUT', url, story).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Upload media for story
   * @param stid story ID
   * @param filename name of the file
   * @param base64code file in base64 format
   * @returns
   */
  public uploadMediaStories(
    stid: any,
    filename: any,
    base64code: any,
    mediafor: any
  ) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/media/v1`;
      let param = {
        stid: stid,
        filename: filename,
        base64code: base64code,
        mediafor: 'report',
      };

      this.http.sendRequest('POST', url, param).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Upload media for user profile
   * @param userid name of the file
   * @param base64code file in base64 format
   * @returns
   */
  public uploadMediaProfile(userid: any, base64code: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/user/profilepic/v1`;
      let param = {
        userid: userid,
        base64code: base64code,
      };

      this.http.sendRequest('PUT', url, param).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Get story with desired filters, if any
   * @param limit number of items per page
   * @param page page number for pagination
   * @param userid search term for story
   * @returns Promise with blog object
   */
  public storylistbyuser(
    limit = 10,
    page = 1,
    userid = this.currentUser.userId,
    categoryname = '',
    search = '',
    status = '',
    header: any
  ) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/listByUser/v1?limit=${limit}&pageno=${page}&userid=${userid}&categoryname=${categoryname}&search=${search}`;

      if (status) {
        url = `${this.config.baseUri}/stories/listByUser/v1?limit=${limit}&pageno=${page}&userid=${userid}&categoryname=${categoryname}&search=${search}&status=${status}`;
      }

      //WHEN LOOGED-IN USER IS SUPERADMIN OR CAMPAIGN MANAGER seoteam
      if (
        this.currentUser &&
        this.currentUser.roles &&
        (this.currentUser.roles.includes('superadmin') ||
          this.currentUser.roles.includes('campaignmanager') ||
          this.currentUser.roles.includes('seoteam') ||
          this.currentUser.roles.includes('seoteamlead'))
      ) {
        url = `${this.config.baseUri}/stories/list/v1?limit=${limit}&categoryname=${categoryname}&pageno=${page}&search=${search}`;
        if (status) {
          url = `${this.config.baseUri}/stories/list/v1?limit=${limit}&categoryname=${categoryname}&pageno=${page}&search=${search}&status=${status}`;
        }
      }

      this.http.sendRequest('get', url, {}, header, true).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.story
            ) {
              if (res.data[0].attributes.story.data) {
                // this happens when no data is there, problem in API
                res.data[0].attributes.story['list'] = [];
                delete res.data[0].attributes.story.data;
              }
              resolve(res.data[0].attributes.story);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  public getDonationList(op: any, header: any) {
    return new Promise((resolve, reject) => {
      //let url = `${this.config.baseUri}/donations/fundraiser/v1/${userid}`;
      let url = `${this.config.baseUri}/donations/list/v1`;
      if (op && Object.keys(op).length > 0) {
        let keys = Object.keys(op);
        let i = 1;
        keys.forEach((k) => {
          if (k && op[k]) {
            if (i == 1) {
              url = url + '?' + k + '=' + op[k];
            } else {
              url = url + '&' + k + '=' + op[k];
            }
            i++;
          }
        });
      }

      this.http.sendRequest('get', url, {}, header, true).then(
        (data) => {
          if (data.status == 200) {
            let res = this.parseJson(data.response);
            if (
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.list
            ) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          } else {
            this.triggerAuthFail();
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Upload media for story
   * @param stid story ID
   * @param filename name of the file
   * @param base64code file in base64 format
   * @returns
   */
  public uploadStoriesMedia(
    stid: any,
    filename: any,
    base64code: any,
    mediafor: any
  ) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/media/v1`;
      let param = {
        stid: stid,
        filename: filename,
        base64code: base64code,
        mediafor: mediafor,
      };

      this.http.sendRequest('POST', url, param).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /**
   * Delete story
   * @param stid story ID
   * @returns promise
   */
  public deleteStory(stid: any, type: any, enabletype: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/v1?type=` + type;
      if (type == 'delete') {
        url = `${this.config.baseUri}/stories/v1`;
      }
      if (type == 'enable' && enabletype) {
        url =
          `${this.config.baseUri}/stories/v1?type=` +
          type +
          '&enabletype=' +
          enabletype;
      }
      let param = {
        stid: stid,
      };

      this.http.sendRequest('DELETE', url, param).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }
  /**
   * Delete story
   * @param stid story ID
   * @returns promise
   */
  public deleteNews(nid: any) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/news/v1`;
      let param = {
        nid: nid,
      };

      this.http.sendRequest('DELETE', url, param).then(
        (data) => {
          if (data.status == 401) {
            this.triggerAuthFail();
          } else {
            let res = this.parseJson(data.response);

            if (res.data && res.data[0] && res.data[0].attributes) {
              resolve(res.data[0].attributes);
            } else {
              let errObj = this.commonErrorHandler(res);
              reject(errObj);
            }
          }
        },
        (err) => {
          reject(this.commonErrorHandler(err));
        }
      );
    });
  }

  /*CREATE SLUG BY STRING*/
  public convertToSlug(Text: any) {
    return Text.toLowerCase()
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/ /g, '-')
      .replace(/--/g, '-');
  }
}
