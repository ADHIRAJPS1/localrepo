import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Config } from 'src/app/services/config';
import AOS from 'aos';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.css'],
})
export class NewsDetailsComponent implements OnInit {
  public slug: any;
  public news: any;
  currentPageUrl: string = '';

  constructor(
    public apiService: ApiService,
    private route: ActivatedRoute,
    public toastr: ToastrService,
    public config: Config,
    public router: Router
  ) {
    this.slug = this.route.snapshot.paramMap.get('slug');
  }

  ngOnInit(): void {
    if (this.slug.length > 0) {
      this.getNewsDetails();
      this.currentPageUrl = this.config.appUri + '/news/' + this.slug;
    } else {
      this.router.navigate(['/']);
    }
    AOS.init();
  }

  getNewsDetails() {
    this.config.showLoading();
    let allNews: any = localStorage.getItem('news');

    try {
      allNews = JSON.parse(allNews);

      allNews.forEach((news) => {
        if (news.cslug == this.slug) {
          this.news = news;
          this.config.dismissLoading();
        }
      });
    } catch (e) {
      console.log('error encountered: ', e);
      this.router.navigate(['/']);
    }
  }
}
