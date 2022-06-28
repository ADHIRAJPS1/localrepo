import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Config } from 'src/app/services/config';

export interface causecase {
  img: string;
  title: string;
  summary: string;
}
@Component({
  selector: 'app-activitiesdetails',
  templateUrl: './activitiesdetails.component.html',
  styleUrls: ['./activitiesdetails.component.css']
})
export class ActivitiesdetailsComponent implements OnInit {

  constructor(public config: Config) { }

  ngOnInit(): void {
    this.config.dismissLoading();
  }


  moreactivitydetails: OwlOptions = {
    loop: true,
    items: 3,
    margin: 30,
    autoplay: true,
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

  public cases: causecase[] = [
    {
      img: './assets/images/activities/5-SM603113.png',
      title: 'The State of the World is Midwifery 2021',
      summary: 'In 2020, UNFPA wilnessed the greatest humanitarian crisis since the organization is creation 52 years ago: the COVID-19 pandemic. The public health catastrophe brought with it socioeconomic,...',
    },

    {
      img: './assets/images/activities/8-SM601468.png',
      title: 'The State of the World is Midwifery 2021',
      summary: 'In 2020, UNFPA wilnessed the greatest humanitarian crisis since the organization is creation 52 years ago: the COVID-19 pandemic. The public health catastrophe brought with it socioeconomic,...',
    },

    {
      img: './assets/images/activities/220-SM401262.png',
      title: 'The State of the World is Midwifery 2021',
      summary: 'In 2020, UNFPA wilnessed the greatest humanitarian crisis since the organization is creation 52 years ago: the COVID-19 pandemic. The public health catastrophe brought with it socioeconomic,...',
    }
  ]

}
