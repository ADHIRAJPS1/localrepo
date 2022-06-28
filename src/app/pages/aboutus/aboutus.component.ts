import { Component, AfterViewInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Config } from 'src/app/services/config';
import AOS from 'aos';
export interface PGCreport {
  img: string;
  img1: string;
  title: string;
  calender: string;
}
export interface Report {

  img: string;
  title: string;
  summary: string;
}
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements AfterViewInit {

  constructor(public config: Config) { }
  ngOnInit() {
    AOS.init();
  }

  reportAnnual: OwlOptions = {
    loop: true,
    items: 3,
    margin: 30,
    autoplay: true,
    dots: false,
    nav: true,
    autoplayTimeout: 8500,
    smartSpeed: 450,
    navText: ['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      1170: {
        items: 3
      }
    }
  }

  reportImpact: OwlOptions = {
    loop: true,
    items: 3,
    margin: 30,
    autoplay: true,
    dots: false,
    nav: true,
    autoplayTimeout: 8500,
    smartSpeed: 450,
    navText: ['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      1170: {
        items: 3
      }
    }
  }

  public annualreport: PGCreport[] = [
    {
      img: './assets/images/About-us/Group44.png',
      img1: './assets/images/About-us/Group47.png',
      title: 'Chemicals in India:<br/> The Right Chemistry for growth',
      calender: '2020-2021',
    },
    {
      img: './assets/images/About-us/Group45.png',
      img1: './assets/images/About-us/Group48.png',
      title: 'Chemicals in India:<br/> The Right Chemistry for growth',
      calender: '2020-2021',
    },
    {
      img: './assets/images/About-us/Group46.png',
      img1: './assets/images/About-us/Group49.png',
      title: 'Chemicals in India:<br/> The Right Chemistry for growth',
      calender: '2020-2021',
    },

  ];

  public impactreport: Report[] = [
    {
      img: './assets/images/About-us/1-SM206786.png',
      title: 'Project Global Cure receive $10,000 Grant for helping people',
      summary: '17 Aug 2021',
    },
    {
      img: './assets/images/About-us/3-SM91241.png',
      title: 'Project Global Cure receive $10,000 Grant for helping people',
      summary: '17 Aug 2021',
    },
    {
      img: './assets/images/About-us/1-SS280695.png',
      title: 'Project Global Cure receive $10,000 Grant for helping people',
      summary: '17 Aug 2021',
    },
  ];

  ngAfterViewInit() {
    this.config.dismissLoading();
  }
}
