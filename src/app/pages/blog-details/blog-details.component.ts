import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Config } from 'src/app/services/config';
import { Meta, Title  } from '@angular/platform-browser';
import AOS from 'aos';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css'],
})
export class BlogDetailsComponent implements OnInit {
  public blogslug: any;
  public blogData: any;
  public relatedBlogsData: any[];
  currentPageUrl: string = '';

  constructor(
    public apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public toastr: ToastrService,
    public config: Config,
    private title: Title,
    private meta : Meta,
    @Inject(DOCUMENT) private document: any,
  ) {
    this.blogslug = this.route.snapshot.paramMap.get('blogslug');
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    AOS.init({
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,
    });
    if (this.blogslug.length > 0) {
      this.blogData = this.route.snapshot.data.blog.blogs;
      //console.log(this.blogData)
      this.title.setTitle(this.blogData.title ? this.blogData.title:'Project Global Cure - Transforming The Health Sector - PGC.');
      this.meta.updateTag({name:'keywords', content:this.blogData.metakeywords ? this.blogData.metakeywords:'funds for medical emergency, Get help for medical treatment, help for poor people, charity donation, Donation online,help for poor people.'});
      this.meta.updateTag({name:'title', content:this.blogData.metatitle ? this.blogData.title:'Project Global Cure - Transforming The Health Sector - PGC.'});
      this.meta.updateTag({name:'description', content:this.blogData.metadescription ? this.blogData.metadescription:'Project Global Cure strives to provide quality health services with increased accessibility to transform the health sector and build a healthy India by 2030.'});
      this.meta.updateTag({name:'og:title', content:this.blogData.metatitle ? this.blogData.title:'Project Global Cure - Transforming The Health Sector - PGC.'});
      this.meta.updateTag({name:'og:description', content:this.blogData.metadescription ? this.blogData.metadescription:'Project Global Cure strives to provide quality health services with increased accessibility to transform the health sector and build a healthy India by 2030.'});
      this.meta.updateTag({name:'twitter:title', content:this.blogData.metatitle ? this.blogData.title:'Project Global Cure - Transforming The Health Sector - PGC.'});
      this.meta.updateTag({name:'twitter:description', content:this.blogData.metadescription ? this.blogData.metadescription:'Project Global Cure strives to provide quality health services with increased accessibility to transform the health sector and build a healthy India by 2030.'});
      this.meta.updateTag({name:'og:image', content:this.blogData.featuredimage ? this.blogData.featuredimage:'https://www.projectglobalcure.org/assets/images/og-image-logo2.jpg'});
      this.meta.updateTag({name:'twitter:image', content:this.blogData.featuredimage ? this.blogData.featuredimage:'https://www.projectglobalcure.org/assets/images/og-image-logo2.jpg'});
      this.relatedBlogsData = this.route.snapshot.data.blog.relatedblogs;
      this.currentPageUrl = this.document.location.href;    }
  }
}
