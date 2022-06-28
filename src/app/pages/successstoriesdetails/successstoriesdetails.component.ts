import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Config } from 'src/app/services/config';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-successstoriesdetails',
  templateUrl: './successstoriesdetails.component.html',
  styleUrls: ['./successstoriesdetails.component.css'],
})
export class SuccessstoriesdetailsComponent implements OnInit {
  public relatedStoriesData: any[];
  public storyData: any;
  public storyslug: any;
  public currentPageUrl: string = '';
  currentdata: any;
  public successstoriesdata: Array<any> = [];

  constructor(
    public config: Config,
    public toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute,
    public apiService: ApiService,
    public _router: Router
  ) {
    this.storyslug = this.route.snapshot.paramMap.get('storyslug');
  }

  ngOnInit() {
    this.getSuccessStoriesList();
    // start navigate latest campaign
    this._router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this._router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this._router.navigated = false;
      }
    });
    // end navigate latest campaign

    if (this.storyslug.length > 0) {
      this.getStoryDetails();
      this.currentPageUrl =
        this.config.appUri + '/successstories/' + this.storyslug;
    } else {
      this.config.dismissLoading();
    }
  }

  getStoryDetails() {
    this.config.showLoading();
    this.apiService.getStoryDetails(this.storyslug).then(
      (res: any) => {
        this.currentdata = res;
        this.storyData = res.story;
        console.log(this.storyData)
        this.relatedStoriesData = res.relatedstories;
        this.config.dismissLoading();

        window.scroll(0, 0);
      },
      (err) => {
        this.config.dismissLoading();
        console.log('error encountered: ', err);
      }
    );
  }

  successoptions: any = {
    limit: 4,
    offset: 0,
    pageno: 1,
    search: '',
    total: 0,
    status: 'completed',
  };

  getSuccessStoriesList() {
    return new Promise((resolve) => {
      this.apiService
        .getStoriesListService(
          this.successoptions.limit,
          this.successoptions.pageno,
          this.successoptions.search,
          this.successoptions.status
        )
        .then(
          (story: any) => {
            this.successstoriesdata = story.list;
            resolve(true);
          },
          (err) => {
            resolve(false);
            console.log('error encountered: ', err);
          }
        );
    });
  }

  loadCase(slug) {
    this.storyslug = slug;
    this.location.replaceState('/successstoriesdetails/' + slug);
    this.ngOnInit();
  }
}
