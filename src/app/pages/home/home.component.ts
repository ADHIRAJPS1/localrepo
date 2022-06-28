import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Config } from 'src/app/services/config';
import { ActivatedRoute, Router } from '@angular/router';
import AOS from 'aos';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  public successstoriesdata: Array<any> = [];
  public newslist: Array<any> = [];
  public medicalCase: Array<any> = [];
  public blog: Array<any> = [];
  public video_1: string = 'EH4mPZFbnMY';
  public video_2: string = 'Qu8XUCGlAvM';
  public video_3: string = 'EH4mPZFbnMY';
  public pgcbanner = [
    {
      img: './assets/images/landing-page/banner/first-banner.webp',
      title:
        'Transforming the Medical Sector Through Technologies and Innovations',
    },
    {
      img: './assets/images/landing-page/banner/Emergency-Fund.webp',
      title: 'Creating a Contingency Fund for Medical Emergencies',
    },
    {
      img: './assets/images/landing-page/banner/3rd-banner.webp',
      title: 'Dedicated to a Healthy Human Race for a Better World',
    },
    {
      img: './assets/images/landing-page/banner/banner-4.webp',
      title: 'Every Penny Donated Could Save a Life',
    },
    {
      img: './assets/images/landing-page/banner/unconditional-support.webp',
      title: 'Providing Unconditional Support',
    },
    {
      img: './assets/images/landing-page/banner/Layer-0.webp',
      title: 'Standing United With Our Government to Fight COVID-19',
    },
  ];

  public events = [
    {
      img: './assets/images/landing-page/event-emailer.webp',
      title: 'World Meditation Day',
      summary: 'Events: Covid-19 Stress Relief - Let is Heal Overselves',
      eventpara1: 'Date: 21st May 2021 ',
      relief: 'Time: 5:30PM',
      eventpara2: 'Join Zoom Meeting',
      eventlink: 'https://us02web.zoom.us/j/82687860808',
      support: 'Ritu Gupta - Fitness Hub',
    },
    {
      img: './assets/images/landing-page/1080x1920.webp',
      title: 'Covid - 19 Food Distribution',
      summary: 'Do not lose your spirit in the fight against Covid -19',
      relief: 'Corona Virus Relief Fund',
      eventpara1: 'location: Bihar',
      eventpara2: 'Donate Now:',
      eventlink: 'https://milaap.org/fundraisers/support-india',
      support: 'Please Support',
    },
  ];

  pgchomebanner: OwlOptions = {
    loop: true,
    items: 1,
    margin: 30,
    autoplay: true,
    dots: false,
    nav: false,
    autoplayTimeout: 8500,
    smartSpeed: 450,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
  };

  constructor(
    public apiService: ApiService,
    public toastr: ToastrService,
    public config: Config,
    public route: ActivatedRoute,
    public router: Router,
    @Inject(DOCUMENT) private dom,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.config.showLoading();
  }

  ngOnInit() {
    AOS.init({
      duration: 500,
    });
    let promises = [
      this.getStoriesList(),
      this.getNewsList(),
      this.getSuccessStoriesList(),
      this.getNews(),
    ];

    Promise.all(promises).then((res) => {
      setTimeout(() => {
        this.config.dismissLoading();
      }, 500);
    });

    let pgcdiscover1: any = this.dom.querySelector('.pgcdiscover1');
    pgcdiscover1.onmouseover = () => {
      this.mouseOver(
        'url("./assets/images/landing-page/Saving-Lives-Amid-the-Coronavirus-Pandemic.webp")'
      );
    };

    let pgcdiscover2: any = this.dom.querySelector('.pgcdiscover2');
    pgcdiscover2.onmouseover = () => {
      this.mouseOver(
        'url("./assets/images/landing-page/Creating-Contingency-Funds-to-Help-the-Needy.webp")'
      );
    };

    let pgcdiscover3: any = this.dom.querySelector('.pgcdiscover3');
    pgcdiscover3.onmouseover = () => {
      this.mouseOver(
        'url("./assets/images/landing-page/Easy-Access-to-Medical-Services-Through-Technical-Advancement.webp")'
      );
    };

    let pgcdiscover4: any = this.dom.querySelector('.pgcdiscover4');
    pgcdiscover4.onmouseover = () => {
      this.mouseOver(
        'url("./assets/images/landing-page/Better-Connection-to-Create-a-Healthier-Society.webp")'
      );
    };

    if (isPlatformBrowser(this.platformId)) {
      $(document).ready(function () {
        $('.modalclick').on('click', function (e) {
          e.preventDefault();
          var src = $(this).attr('href');
          $('#myModal').modal('show');
          $('#myModal iframe').attr('src', src);
        });
        //auto close or pause on model hide
        $('#myModal').on('hidden.bs.modal', function (e) {
          $('#myModal iframe').attr('src', '');
        });
      });
    }
  }

 OnClikPlay(url){
  let u = url;
  console.log(url);
 // const player = this.elRef.nativeElement.querySelector('video');
 // player.load();
 }
  mouseOver(bg) {
    if (bg) {
      let a: any = this.dom.querySelector('.pgc-discover');
      a.style.backgroundImage = bg;
    }
  }

  getNewsList() {
    return new Promise((resolve) => {
      this.apiService.getNewsListService(3).then(
        (news: any) => {
          this.newslist = news.list;
          this.storeNewsLocally();
          resolve(true);
        },
        (err) => {
          resolve(false);
          console.log('error encountered: ', err);
        }
      );
    });
  }

  openNews(news) {
    this.router.navigateByUrl('/news/' + news.cslug);
  }

  storeNewsLocally() {
    let str = JSON.stringify(this.newslist);
    localStorage.setItem('news', str);
  }

  getStoriesList() {
    return new Promise((resolve) => {
      this.apiService.getStoriesListService(3, 1, '', 'published').then(
        (story: any) => {
          this.medicalCase = story.list;
          resolve(true);
        },
        (err) => {
          resolve(false);
          console.log('error encountered: ', err);
        }
      );
    });
  }

  getSuccessStoriesList() {
    return new Promise((resolve) => {
      this.apiService.getStoriesListService(4, 1, '', 'completed').then(
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

  getNews() {
    return new Promise((resolve) => {
      this.apiService.getBlogListService(3).then(
        (res: any) => {
          this.blog = res.list;
          resolve(true);
        },
        (err) => {
          resolve(false);
          console.log('error encountered: ', err);
        }
      );
    });
  }
}
