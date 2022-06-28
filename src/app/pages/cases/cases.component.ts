import { Component, OnInit, HostListener } from '@angular/core';
import { Config } from 'src/app/services/config';
import { ApiService } from 'src/app/services/api.service';
import { Meta, Title } from '@angular/platform-browser';
import AOS from 'aos';
@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.css'],
})
export class CasesComponent implements OnInit {
  search = '';
  stories: any[] = [];
  successstories: any[] = [];
  categoryList: any;
  isActiveTab: string = 'published';
  showNoResultTest: boolean = false;
  showSpinner: boolean = false;

  onScrollDown() {
    if (this.options.total > this.options.pageno * this.options.limit) {
      this.options.pageno++;
      this.getStoriesList();
    }
  }

  onScrollUp() {
    if (this.options.total > this.options.pageno * this.options.limit) {
      this.options.pageno++;
      this.getStoriesList();
    }
  }
  onScrollDownSuccess() {
    if (
      this.successoptions.total >
      this.successoptions.pageno * this.successoptions.limit
    ) {
      this.successoptions.pageno++;
      this.getsuccessStoriesList();
    }
  }

  onScrollUpSuccess() {
    if (
      this.successoptions.total >
      this.successoptions.pageno * this.successoptions.limit
    ) {
      this.successoptions.pageno++;
      this.getsuccessStoriesList();
    }
  }
  options: any = {
    limit: 6,
    offset: 0,
    pageno: 1,
    search: '',
    total: 0,
    categoryname: '',
    status: 'published',
  };
  successoptions: any = {
    limit: 6,
    offset: 0,
    pageno: 1,
    search: '',
    total: 0,
    categoryname: '',
    status: 'completed',
  };
  isloadMoreBtn = true;
  issuccessloadMoreBtn = true;

  constructor(
    public apiService: ApiService,
    private title: Title,
    public config: Config
  ) {}

  ngOnInit() {
    AOS.init({
      duration: 500,
    });
    this.getStoriesList();
    this.getsuccessStoriesList();
  }

  getStoriesList(reset = false) {
    this.config.showLoading();
    this.showSpinner = true;
    this.apiService
      .getStoriesListService(
        this.options.limit,
        this.options.pageno,
        this.options.search,
        this.options.status,
        this.options.categoryname
      )
      .then(
        (story: any) => {
          if (story && story.list && story.list.length > 0) {
            if (reset == false) {
              let data = story.list;
              this.stories = [...this.stories, ...data];
            } else {
              this.stories = story.list.length > 0 ? story.list : [];
            }
            this.options = story.options;
          } else {
            this.stories = story.list.length > 0 ? story.list : [];
          }
          this.stories = this.stories.filter(
            (v, i, a) => a.findIndex((v2) => v2.stid === v.stid) === i
          );
          if (this.stories.length == 0) {
            this.showNoResultTest = true;
          }
          setTimeout(() => {
            this.showSpinner = false;
          }, 2500);
          this.config.dismissLoading();
        },
        (err) => {
          this.showSpinner = false;
          this.config.dismissLoading();
        }
      );
  }

  getsuccessStoriesList(reset = false) {
    this.showSpinner = true;
    this.config.showLoading();
    this.apiService
      .getStoriesListService(
        this.successoptions.limit,
        this.successoptions.pageno,
        this.successoptions.search,
        this.successoptions.status,
        this.successoptions.categoryname
      )
      .then(
        (story: any) => {
          if (reset == false) {
            let data = story.list ? story.list : [];
            this.successstories = [...this.successstories, ...data];
          } else {
            this.successstories = story.list.length > 0 ? story.list : [];
          }
          if (story.options && story.options) {
            this.successoptions = story.options;
            this.issuccessloadMoreBtn =
              this.successoptions.total > this.successstories.length
                ? true
                : false;
          }
          this.successstories = this.successstories.filter(
            (v, i, a) => a.findIndex((v2) => v2.stid === v.stid) === i
          );
          if (this.successstories.length == 0) {
            this.showNoResultTest = true;
          }
          setTimeout(() => {
            this.showSpinner = false;
          }, 2500);
          this.config.dismissLoading();
        },
        (err) => {
          this.showSpinner = false;
          this.config.dismissLoading();
        }
      );
  }

  loanextPageData() {
    if (this.successoptions.total > this.successstories.length) {
      this.successoptions.pageno++;
      // console.log(this.successoptions.pageno)
      this.getsuccessStoriesList();
    } else {
      this.isloadMoreBtn = false;
    }
  }

  getDescriptionsData(data) {
    //  let d = data.replace(/\s/g, "")
    return data
      .replace(/['"]+/g, '')
      .substring(0, this.config.summaryStringlimit);
  }
  getTitleSuccess(data: any) {
    this.search = '';
    this.showNoResultTest = false;
    this.isActiveTab = 'success';
    this.resetSearchData();
    this.title.setTitle(
      data
        ? data
        : 'Project Global Cure - Transforming The Health Sector - PGC.'
    );
    //console.log(data)
  }
  getTitle(data: any) {
    this.search = '';
    this.isActiveTab = 'published';
    this.showNoResultTest = false;
    this.resetSearchData();
    this.title.setTitle(
      data
        ? data
        : 'Project Global Cure - Transforming The Health Sector - PGC.'
    );
    // console.log(data)
  }
  resetSearchData() {
    this.showNoResultTest = false;
    this.search = '';
    if (this.isActiveTab == 'published') {
      this.options.pageno = 1;
      this.options.offset = 0;
      this.options.total = 0;
      this.options.search = '';
      this.options.categoryname = '';
      this.options.status = 'published';
      this.stories = [];
      this.getStoriesList();
    } else {
      this.successoptions.pageno = 1;
      this.successoptions.offset = 0;
      this.successoptions.total = 0;
      this.successoptions.search = '';
      this.successoptions.categoryname = '';
      this.successoptions.status = 'completed';
      this.successstories = [];
      this.getsuccessStoriesList();
    }
  }
  searchData() {
    if (this.isActiveTab == 'published') {
      if (this.search.length > 0) {
        this.options.search = this.search;
        this.options.pageno = 1;
        this.getStoriesList(true);
      } else {
        this.options.pageno = 1;
        this.options.offset = 0;
        this.options.total = 0;
        this.options.search = '';
        this.options.categoryname = '';
        this.options.status = 'published';
        this.stories = [];
        this.getStoriesList();
      }
    } else {
      if (this.search.length > 0) {
        this.successoptions.search = this.search;
        this.successoptions.pageno = 1;
        this.getsuccessStoriesList(true);
      } else {
        this.successoptions.pageno = 1;
        this.successoptions.offset = 0;
        this.successoptions.total = 0;
        this.successoptions.search = '';
        this.successoptions.categoryname = '';
        this.successoptions.status = 'completed';
        this.successstories = [];
        this.getsuccessStoriesList();
      }
    }
  }
}
