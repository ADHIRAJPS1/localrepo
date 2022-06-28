import { Component, AfterViewInit } from '@angular/core';
import { Config } from 'src/app/services/config';
import { OwlOptions } from 'ngx-owl-carousel-o';
import AOS from 'aos';
declare let $: any;

export interface Testimonils {
  img: string;
  description: string;
  name: string;
  profile: string;
}
@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css'],
})
export class CareerComponent implements AfterViewInit {
  constructor(public config: Config) {
    this.config.dismissLoading();
  }
  ngOnInit(): void {
    AOS.init({
      duration: 600,
    });
  }

  public pgctestimonial: Testimonils[] = [
    {
      img: './assets/images/career/client_team4.png',
      description:
        'I am glad to be a part of the Project Global Cure. This was the most precious time of my life where I connected to people and felt their sufferings. It was a learning experience along with working for a noble cause. I learnt a lot in this span of time. This project taught me a way of life.',
      name: 'Surya Anjitha Chennamsetty',
      profile: 'Marketing Intern',
    },
    {
      img: './assets/images/career/client_team4.png',
      description:
        'Working here we utilized a unique combination of social work, marketing and social media skills to successfully broaden the work applicability and served as a major decision-maker in all strategic planning. This project is an honest, organized, responsible and reliable effort to help people in an emergency situation. I am now a more confident individual with stronger work ethic and a positive attitude. This project taught me a new way of life.',
      name: 'Tania Surana',
      profile: 'Marketing Intern',
    },
    {
      img: './assets/images/career/client_team4.png',
      description:
        'Before joining this noble project my world was just limited to my worldly pleasures. Becoming a volunteer for the       Project Global Cure I saw another side of life.I saw the suffering of people and their condition turning them helpless.I felt deep satisfaction becoming a helping hand for these needy people.Along the way, I gained experience and skills.',
      name: 'Rhea Sethi',
      profile: 'Campus Ambassador Intern',
    },
    {
      img: './assets/images/career/client_team4.png',
      description:
        'I got an opportunity to work with the Project Global Cure with a mindset of serving community. After joining I realised that this project serves a much bigger purpose.Through this project I understood the sufferings of people. People struggling for life with serious medical conditions and their families feeling financially paralysed. Being a part of the Project Global Cure I felt accomplished helping such families and being the ray of light for them. I learnt to deal with real life crisis. This project gave a new direction to my life.',
      name: 'Krishna Rajendra Turkane',
      profile: 'Business Development Intern',
    },
  ];

  ngAfterViewInit() {
    this.config.dismissLoading();
  }
  careertestimonial: OwlOptions = {
    loop: true,
    center: true,
    items: 1,
    margin: 30,
    autoplay: true,
    dots: true,
    nav: false,
    autoplayTimeout: 8500,
    smartSpeed: 450,
    navText: [
      '<i class="fa fa-arrow-left"></i>',
      '<i class="fa fa-arrow-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      1170: {
        items: 1,
      },
    },
  };
}
