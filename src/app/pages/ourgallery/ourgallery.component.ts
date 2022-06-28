import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Config } from 'src/app/services/config';

declare let $: any;

export interface ourgallery {
  img: string;
  title: string;
}

@Component({
  selector: 'app-ourgallery',
  templateUrl: './ourgallery.component.html',
  styleUrls: ['./ourgallery.component.css']
})
export class OurgalleryComponent implements OnInit, AfterViewInit {

  constructor(public config: Config) {
    this.config.dismissLoading();
  }

  public eventgallery: ourgallery[] = [
    {
      img: './assets/images/gallery/120-ER826530.jpg',
      title: 'Event',
    },
    {
      img: './assets/images/gallery/MEDICALTESTFILE.jpg',
      title: 'Event',
    }
  ];

  public humanitygallery: ourgallery[] = [
    {
      img: './assets/images/gallery/1-SM789302.jpg',
      title: 'Humanity',
    },
    {
      img: './assets/images/gallery/5fe08622c44e6.jpg',
      title: 'Humanity',
    },
    {
      img: './assets/images/gallery/6-SM496195.jpg',
      title: 'Humanity'
    },
    {
      img: './assets/images/gallery/220-SM687961.jpg',
      title: 'Humanity'
    },
    {
      img: './assets/images/gallery/gettyimages-1158352674-2048x2048.jpg',
      title: 'Humanity'
    }
  ];
  public volunteergallery: ourgallery[] = [
    {
      img: './assets/images/gallery/5-SS280692.jpg',
      title: 'Volunteer'
    },
    {
      img: './assets/images/gallery/20-SM200946.jpg',
      title: 'Volunteer'
    },

  ];

  public fooddonationgallery: ourgallery[] = [
    {
      img: './assets/images/gallery/120-SM401279.jpg',
      title: 'Food Donation'
    },
    {
      img: './assets/images/gallery/20-SM203234.jpg',
      title: 'Food Donation'
    },

  ];

  ngOnInit(): void {
    $(".filter-button").click(function (this: any) {
      if ($(".filter-button").removeClass("active")) {
        $(this).removeClass("active");
      }
      $(this).addClass("active");

      var value = $(this).attr('data-filter');

      if (value == "all") {
        $('.filter').show('1000');
      }
      else {
        $(".filter").not('.' + value).hide('3000');
        $('.filter').filter('.' + value).show('3000');

      }
    });
  }

  ngAfterViewInit() {
    $(".fancybox").fancybox({
      openEffect: "none",
      closeEffect: "none"
    });
  }

}
