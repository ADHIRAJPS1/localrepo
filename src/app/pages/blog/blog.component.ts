import { Renderer2, OnInit, Inject, Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Config } from 'src/app/services/config';
import AOS from 'aos';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  show = false;
  selected: any;
  filtered: any;
  blogcategory: any;
  search = '';
  blogs: any[] = [];

  options: any = {
    limit: 6,
    offset: 0,
    pageno: 1,
    search: '',
    total: 0,
    status: 'published',
    categoryname: '',
  };
  isloadMoreBtn = true;

  constructor(
    public apiService: ApiService,
    public formBuilder: FormBuilder,
    public toastr: ToastrService,
    public config: Config,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) { }

  toggle() {
    this.show = !this.show;
  }

  public ngOnInit() {
    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://projectglobalcure.org/blogs"
            },
            "headline": "Blogs | Project Global Cure -Transforming The Health Sector | PGC",
            "description": "Find India's top wellness and health blogs on causes, prevention of health conditions, fitness, nutrition, mental and physical health areas.",
            "image": "",
            "author": {
              "@type": "Organization",
              "name": "Project Global Cure"
            },
            "publisher": {
              "@type": "Organization",
              "name": "PGC",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.projectglobalcure.org/assets/images/pgc_logo.svg"
              }
            },
            "datePublished": ""
        }
    `;

    this._renderer2.appendChild(this._document.body, script);
    AOS.init({
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,
    });
    this.getBlogList();
    this.getblogcategorylist();
  }

  searchevent(categoryname) {
    this.search = '';
    this.options.search = '';
    this.options.offset = 0;
    this.options.pageno = 1;
    this.options = { ...this.options, categoryname };
    this.getBlogList(true);
  }

  searchData() {
    if (this.search.length > 0) {
      this.options.search = this.search;
      this.options.pageno = 1;
      this.getBlogList(true);
    } else {
      this.options.pageno = 1;
      this.options.offset = 1;
      this.options.total = 0;
      this.options.search = '';
      this.options.status = '';
      this.options.categoryname = '';
      this.blogs = [];
      this.getBlogList();
    }
  }

  getblogcategorylist() {
    this.apiService.getBlogcategorylist().then(
      (lists: any) => {
        this.blogcategory = lists;
        this.config.dismissLoading();
      },
      (err) => {
        console.log('error encountered', err);
      }
    );
  }

  getBlogList(reset = false) {
    this.apiService
      .getBlogListService(
        this.options.limit,
        this.options.pageno,
        this.options.search,
        this.options.status,
        this.options.categoryname
      )
      .then(
        (blogs: any) => {
          if (reset == false) {
            let data = blogs.list ? blogs.list : [];
            if (data && data.length > 0) {
              this.blogs = [...this.blogs, ...data];
            } else {
              this.toastr.info('0 Records found', '');
            }
          } else {
            this.blogs = blogs.list ? blogs.list : [];
          }
          if (this.blogs && this.blogs.length == 0) {
            this.toastr.info('0 Records found', '');
          }
          this.options = blogs.options;
          this.isloadMoreBtn = this.options.total > this.blogs.length ? true : false;
          this.config.dismissLoading();
        },
        (err) => {
          console.log('error encountered', err);
        }
      );
  }

  loadNextPageData() {
    if (this.options.total > this.blogs.length) {
      this.options.pageno++;
      this.getBlogList();
    } else {
      this.isloadMoreBtn = false;
    }
  }
}
