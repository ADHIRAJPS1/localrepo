import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Config } from 'src/app/services/config';
import AOS from 'aos';
@Component({
  selector: 'app-successstories',
  templateUrl: './successstories.component.html',
  styleUrls: ['./successstories.component.css'],
})
export class SuccessstoriesComponent implements OnInit {
  search = '';
  stories: any[] = [];
  categoryList: any;

  options: any = {
    limit: 6,
    offset: 0,
    pageno: 1,
    search: '',
    total: 0,
    status: 'completed',
    categoryname: '',
  };
  isloadMoreBtn = true;

  constructor(
    public config: Config,
    public toastr: ToastrService,
    public apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.getStoriesList();
    this.getstorycategorylist();
    this.config.dismissLoading();
    AOS.init({
      //offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,
    });
  }

  searchcaselist(categoryname) {
    this.options = { ...this.options, categoryname };
    this.getStoriesList(true);
    this.config.dismissLoading();
  }

  getstorycategorylist() {
    this.apiService.getStorycategorylist().then((list) => {
      this.categoryList = list;
    });
  }
  getStoriesList(reset = false) {
    this.config.showLoading();
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
          if (reset == false) {
            let data = story.list;
            this.stories = [...this.stories, ...data];
          } else {
            this.stories = story.list;
          }
          this.options = story.options;
          this.isloadMoreBtn =
            this.options.total > this.stories.length ? true : false;
          this.config.dismissLoading();
        },
        (err) => {
          this.config.dismissLoading();
        }
      );
  }

  loanextPageData() {
    if (this.options.total > this.stories.length) {
      this.options.pageno++;
      this.getStoriesList();
    } else {
      this.isloadMoreBtn = false;
    }
  }

  getDescriptionsData(data) {
    return data.substring(0, this.config.summaryStringlimit);
  }

  searchData() {
    if (this.search.length > 0) {
      this.options.search = this.search;
      this.options.pageno = 1;

      this.getStoriesList(true);
      this.config.dismissLoading();
    } else {
      this.options.pageno = 1;
      this.options.offset = 1;
      this.options.total = 0;
      this.options.search = '';
      this.options.status = 'completed';
      (this.options.categoryname = ''), (this.stories = []);
      this.getStoriesList();
    }
  }
}
