import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { AppAuth } from './services/app-auth.service';
import { Config } from './services/config';
import { Events } from './shared/app-events';
import { SeoService } from './services/seo.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  preloader: boolean = true;
  data: any;
  medicalData: any;
  messageStringlimit: number = 120;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    public events: Events,
    public auth: AppAuth,
    public toastr: ToastrService,
    public config: Config,
    private spinner: NgxSpinnerService
  ) {
    //this.config.showLoading(); // Show loader by default
    // this.successStoryData = localStorage
    // this.successStoryData = JSON.parse(localStorage.getItem('dataSource'));
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        var rt = this.getChild(this.activatedRoute);
        rt.data.subscribe((data: any) => {
          if (this.router.url.indexOf('/blogs/') > -1) {
            const blogData = data.blog.blogs;
            data.meta = [];
          }
          if (this.router.url.indexOf('/medical-support/') > -1) {
            const storyData = data.story.story;
            // console.log(storyData)
            data.meta = [
              {
                property: 'title',
                content: storyData?.metatitle
                  ? storyData.metatitle
                  : 'Project Global Cure - Transforming The Health Sector - PGC.',
              },
              {
                property: 'description',
                content: storyData?.metadescription
                  ? storyData.metadescription
                  : 'Project Global Cure strives to provide quality health services with increased accessibility to transform the health sector and build a healthy India by 2030.',
              },
              {
                property: 'twitter:card',
                content: 'summary_large_image',
              },
              {
                property: 'og:title',
                content: storyData?.metatitle
                  ? storyData.metatitle
                  : 'Project Global Cure - Transforming The Health Sector - PGC.',
              },
              {
                property: 'og:description',
                content: storyData?.metadescription
                  ? storyData.metadescription
                  : 'Project Global Cure strives to provide quality health services with increased accessibility to transform the health sector and build a healthy India by 2030.',
              },
              {
                property: 'og:image',
                content: storyData?.featuredimage
                  ? storyData.featuredimage
                  : 'https://www.projectglobalcure.org/assets/images/og-image-logo2.jpg',
              },
              {
                property: 'twitter:title',
                content: storyData?.metatitle
                  ? storyData.metatitle
                  : 'Project Global Cure - Transforming The Health Sector - PGC.',
              },
              {
                property: 'twitter:description',
                content: storyData?.metadescription
                  ? storyData.metadescription
                  : 'Project Global Cure strives to provide quality health services with increased accessibility to transform the health sector and build a healthy India by 2030.',
              },
              {
                property: 'twitter:image',
                content: storyData?.featuredimage
                  ? storyData.featuredimage
                  : 'https://www.projectglobalcure.org/assets/images/og-image-logo2.jpg',
              },
              {
                property: 'keywords',
                content: storyData?.metakeywords
                  ? storyData.metakeywords
                  : 'funds for medical emergency, Get help for medical treatment, help for poor people, charity donation, Donation online,help for poor people.',
              },
            ];
          }
          if (this.router.url.indexOf('/medical-awareness/') > -1) {
            const medicalData = data.medical.data;
            data.meta = [
              {
                property: 'title',
                content: medicalData?.name
                  ? medicalData.name
                  : 'Project Global Cure - Transforming The Health Sector - PGC.',
              },
              {
                property: 'description',
                content: this.getDescriptionsData(medicalData?.description),
              },
              {
                property: 'twitter:card',
                content: 'summary_large_image',
              },
              {
                property: 'og:title',
                content: medicalData?.name
                  ? medicalData.name
                  : 'Project Global Cure - Transforming The Health Sector - PGC.',
              },
              {
                property: 'og:description',
                content: this.getDescriptionsData(medicalData?.description),
              },
              {
                property: 'og:image',
                content:
                  'https://www.projectglobalcure.org/assets/images/og-image-logo2.jpg',
              },
              {
                property: 'twitter:title',
                content: medicalData?.name
                  ? medicalData.name
                  : 'Project Global Cure - Transforming The Health Sector - PGC.',
              },
              {
                property: 'twitter:description',
                content: this.getDescriptionsData(medicalData?.description),
              },
              {
                property: 'twitter:image',
                content:
                  'https://www.projectglobalcure.org/assets/images/og-image-logo2.jpg',
              },
              {
                property: 'keywords',
                content: medicalData?.name
                  ? medicalData.name
                  : 'funds for medical emergency, Get help for medical treatment, help for poor people, charity donation, Donation online,help for poor people.',
              },
            ];
          }

          if (data && data.meta) {
            this.seoService.updateTitle(data.title);
            this.seoService.updateMetaTags(data.meta);
          }
          this.seoService.updateMetaUrls(this.router.url);
          this.seoService.loadHeaderScript(this.router.url);
        });
      });

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  ngAfterViewInit() {
    this.events.subscribe('user:logout', (showDialog) => {
      this.auth.logout();
      this.router.navigate(['/'], { replaceUrl: true });

      if (showDialog) {
        setTimeout(() => {
          // this.toastr.error('Your session has expired, please login again!');
        }, 500);
      }
    });

    this.events.subscribe('tokenChanged', (tokens) => {
      this.auth.updateTokens(tokens); // or this, not both
    });

    this.events.subscribe('refreshFail', () => {
      this.events.publish('user:logout', true);
    });

    this.initializeUser();
  }

  async initializeUser() {
    let res = await this.auth.loadStoredUser();

    if (res !== undefined) {
      await this.auth.preloadAppData();

      setTimeout(() => {
        this.preloader = false;
      }, 500);
      // this.analytics.recordEvent("autologin");
    } else {
      // this.router.navigate(['/'], { replaceUrl: true });
      setTimeout(() => {
        this.preloader = false;
      }, 500);
    }
  }
  getDescriptionsData(data: any) {
    let des = data.replace(/(<([^>]+)>)/gi, '');
    return des.substring(0, this.messageStringlimit);
  }
}
