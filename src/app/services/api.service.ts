import { Injectable } from '@angular/core';
import { Config } from '../services/config';
import { AppHttp } from '../services/app-http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    public config: Config,
    public appHttp: AppHttp
  ) {}

  /**
   *
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
   *
   * @param res JSON response returned by web service
   * @returns Object { "title": "Something", "detail": "some detail" };
   */
  commonErrorHandler(res) {
    if (res.errors && res.errors.length > 0) {
      // See of there are errors returned by server
      return res.errors[0];
    } else {
      // Else return a generic error object as per config
      return this.config.defaultError;
    }
  }

  /**
   *
   * @param data Contact form data object
   * @returns Promise with success or error response
   */
  postContact(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/contact/v1`;
      this.appHttp.sendRequest('post', url, data, {}, true).then(
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
   *
   * @param Start FundRaiser form data object
   * @returns Promise with success or error response
   */
  startFundRPost(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/anonymousstory/v1`;
      this.appHttp.sendRequest('post', url, data, {}, true).then(
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
   * DUMMY CALL - *** API NOT READY YET ***
   * @param data
   * @returns
   */
  createDonate(data) {
    const formDataile = new FormData();
    const API_URL = `${this.config.baseUri}/view/createDonate`;
    return this.http.post(API_URL, data); //.pipe(catchError(this.errorMgmt));
  }

  /**  Blog Category
   * @returns
   */

  getBlogcategorylist() {
    return new Promise((resolve, reject) => {
      let queryParams = '';

      let url = `${this.config.baseUri}/blogs/categories/v1?${queryParams}`;
      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
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
  /**  Blog Category
   * @returns
   */

  getuserDetails(usrid, header) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/user/details/v1?userid=${usrid}`;
      this.appHttp.sendRequest('GET', url, {}, header, true).then(
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
              res.data[0].attributes
              // res.data[0].attributes.list
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
   * Get Blog List data
   * @param limit
   * @param pageno
   * @param search
   * @param status
   * @param categoryname
   * @returns Promise with blogs object
   */
  getBlogListService(limit?, pageno?, search?, status?, categoryname?) {
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
        queryParams = queryParams + '&categoryname=' + categoryname;
      }

      let url = `${this.config.baseUri}/blogs/search/v1?${queryParams}`;
      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
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
              res.data[0].attributes.blogs
            ) {
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

  /**
   * Get details of blog by slug
   * @param blogslug slug of the blog
   * @returns
   */
  getBlogDetails(blogslug) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/blogs/details/v1/${blogslug}`;
      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
        (data) => {
          if (data.status == 401) {
            let err = {
              title: 'Unauthorised Access Detected!',
              detail: 'Please login first.',
            };
            reject(err);
          } else {
            let res;

            if (data.response) {
              res = this.parseJson(data.response);
            } else if (data.responseText) {
              // SSR support
              res = this.parseJson(data.responseText);
            }

            if (
              res &&
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.blogs
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

  /**  Blog Category
   * @returns
   */

  getStorycategorylist() {
    return new Promise((resolve, reject) => {
      let queryParams = '';

      let url = `${this.config.baseUri}/stories/categories/v1?${queryParams}`;
      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
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
   * Get story list
   * @param limit
   * @param pageno
   * @param search
   * @param status
   * @param categoryname
   * @returns Promise with story objects
   */
  getStoriesListService(limit?, pageno?, search?, status?, categoryname?) {
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
        queryParams = queryParams + '&categoryname=' + categoryname;
      }

      let url = `${this.config.baseUri}/stories/search/v1?${queryParams}`;

      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
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
              res.data[0].attributes.story
            ) {
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
   * Get details of a story by slug
   * @param storyslug - slug of the story
   * @returns
   */
  getStoryDetails(storyslug) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/details/v1/${storyslug}`;
      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
        (data) => {
          if (data.status == 401) {
            let err = {
              title: 'Unauthorised Access Detected!',
              detail: 'Please login first.',
            };
            reject(err);
          } else {
            let res;
            if (data.response) {
              res = this.parseJson(data.response);
            } else if (data.responseText) {
              // SSR support
              res = this.parseJson(data.responseText);
            }
            if (
              res &&
              res.data &&
              res.data[0] &&
              res.data[0].attributes &&
              res.data[0].attributes.story
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
   * Get story Donation list
   * @param limit
   * @param pageno
   * @returns Promise with story Donation objects
   */
  getStoriesdonationListService(limit?, pageno?, campaignid?) {
    return new Promise((resolve, reject) => {
      let queryParams = '';

      if (limit && limit != null && limit != undefined) {
        queryParams = queryParams + 'limit=' + limit;
      }
      if (pageno && pageno != null && pageno != undefined) {
        queryParams = queryParams + '&pageno=' + pageno;
      }

      let url =
        `${this.config.baseUri}/donations/list/v1/` +
        campaignid +
        `?${queryParams}`;
      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
        (data) => {
          if (data.status == 401) {
            let err = {
              title: 'Unauthorised Access Detected!',
              detail: 'Please login first.',
            };
            reject(err);
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
   * Get Medical Topics List data
   * @param limit
   * @param pageno
   * @param search
   * @returns Promise with Medical object
   */
  gethealthListService() {
    return new Promise((resolve, reject) => {
      let queryParams = '';

      let url = `${this.config.baseUri}/healthtopics/list/v1?${queryParams}`;
      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
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
   * Get details of a story by slug
   * @param htid - slug of the story
   * @returns
   */
  getMeddicalTopicsDetails(slug) {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/healthtopics/detailsbyslug/v1/${slug}`;
      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
        (data) => {
          if (data.status == 401) {
            let err = {
              title: 'Unauthorised Access Detected!',
              detail: 'Please login first.',
            };
            reject(err);
          } else {
            let res;
            if (data.response) {
              res = this.parseJson(data.response);
            } else if (data.responseText) {
              // SSR support
              res = this.parseJson(data.responseText);
            }
            if (
              res &&
              res.data &&
              res.data[0] &&
              res.data[0].attributes
              // res.data[0].attributes.list
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
   * Get Covid-19 List data
   *
   * @returns Promise with Covid-19 object
   */
  getcovidListService() {
    return new Promise((resolve, reject) => {
      let queryParams = '';

      let url = `${this.config.baseUri}/covid19/list/v1?${queryParams}`;

      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
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
              res.data[0].attributes.record
            ) {
              resolve(res.data[0].attributes.record);
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
   * Get Event List data
   * @param limit
   * @param pageno
   * @returns Promise with Event object
   */
  getEventListService(limit, pageno) {
    return new Promise((resolve, reject) => {
      let queryParams = '';

      if (limit && limit != null && limit != undefined) {
        queryParams = queryParams + 'limit=' + limit;
      }
      if (pageno && pageno != null && pageno != undefined) {
        queryParams = queryParams + '&pageno=' + pageno;
      }

      let url = `${this.config.baseUri}/events/list/v1?${queryParams}`;
      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
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
              res.data[0].attributes.events
            ) {
              resolve(res.data[0].attributes.events);
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
   *
   * @param fieldexecutivePost to Us Date
   * @returns Promise with success or error response
   */
  fieldexecutivePost(d: any, headers: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/child/v1`;
      this.appHttp.sendRequest('post', url, d, {}, false).then(
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
   *
   * @param refers to Us Date
   * @returns Promise with success or error response
   */
  referToUsPost(refers): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/referred/v1`;
      this.appHttp.sendRequest('post', url, refers, {}, true).then(
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
   *
   * @param donate data object
   * @returns Promise with success or error response
   */
  Donation(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/donations/v1`;
      this.appHttp.sendRequest('post', url, data, {}, true).then(
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
   *
   * @param bank to Us Date
   * @returns Promise with success or error response
   */
  storysupdate(bank): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/v1`;
      this.appHttp.sendRequest('put', url, bank, {}, true).then(
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
   *
   * @param bank to Us Date
   * @returns Promise with success or error response
   */
  storysuserupdate(bank): Promise<any> {
    // let tokens = this.config.tokens;
    // let headers = new HttpHeaders({
    //   Authorization: `Bearer ${tokens.refresh}`,
    //   'Content-Type': 'application/json',
    // });

    // let options = {
    //   headers: headers,
    // };

    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/stories/v1`;
      this.appHttp.sendRequest('put', url, bank, {}, true).then(
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
   * Get story list
   * @param limit
   * @param pageno
   * @returns Promise with story objects
   */
  getNewsListService(limit = 3, pageno?) {
    return new Promise((resolve, reject) => {
      let queryParams = '';

      if (limit && limit != null && limit != undefined) {
        queryParams = queryParams + 'limit=' + limit;
      }
      if (pageno && pageno != null && pageno != undefined) {
        queryParams = queryParams + '&pageno=' + pageno;
      }

      let url = `${this.config.baseUri}/news/list/v1?${queryParams}`;
      this.appHttp.sendRequest('GET', url, {}, {}, true).then(
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
              res.data[0].attributes.news
            ) {
              resolve(res.data[0].attributes.news);
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
   *
   * @param data Contact form data object
   * @returns Promise with success or error response
   */
  postUserUpdate(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = `${this.config.baseUri}/user/update/v1`;
      this.appHttp.sendRequest('put', url, data, {}, true).then(
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
}
