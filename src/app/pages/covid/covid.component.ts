import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Config } from 'src/app/services/config';

declare let $: any;

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.css'],
})
export class CovidComponent implements OnInit, AfterViewInit {
  public currentPageUrl: string = '';
  coviddata: any;
  socialshareed = false;
  news = [
    {
      date: '10-05-2021',
      content:
        "India will face shortage of COVID-19 vaccines till July as said by (Serum Institute of India) SII chief Adar Poonawalla. India's pandemic condition is getting worse as compared to other nations as the nation was not expecting this second wave to be so deadly.",
    },
    {
      date: '10-05-2021',
      content:
        'Varun Chakravarthy and Sandeep Warrier players from the Kolkata Knight Riders team, test positive for COVID-19. This led to the cancellation of the IPL match of Kolkata Knight Riders against Royal Challengers Bangalore in Ahmedabad.',
    },
    {
      date: '10-05-2021',
      content:
        "The Managing Director of glassware company Borosil Ltd and Borosil Renewable Ltd based in Mumbai has said to provide financial assistance to the families of employees who died of COVID-19. Their families will be given two years salary along with their children's education till graduation in India.",
    },
    {
      date: '10-05-2021',
      content:
        'Flights from the US carrying medical supplies for India to help in these tough times are delayed till Wednesday due to some maintenance issues. So, far only two flights have landed in India and we are looking forward to three more flights for medical assistance by Wednesday.',
    },
    {
      date: '10-05-2021',
      content:
        'Delhi administration has announced to shut Chandni Chowk market till April 15 due to rise in COVID cases as India is hard hit by the UK variant. The Delhi Kirana Committee of Khari Baoli Market and the Chemical Merchant Association of Tilak Bazaar also announced the closing of markets till April 21.',
    },
    {
      date: '30-04-2021',
      content:
        'IIT Kanpur and IIT Hyderabad scientists predicted a high spike in Covid-19 cases by mid-May 2021. The second wave of the ongoing pandemic has turned lives and the economy upside down. There are daily reports of a surge in covid positive cases and deaths due to covid. On Friday, India experienced a single-day growth in 3,32,730 (3.32 lakh) COVID-19 infections and 2,263 fatalities with 24,28,616 (24.28 lakh) active cases. India is going through a tough phase and we all need to stay united.',
    },
    {
      date: '30-04-2021',
      content:
        'The new variant of Covid has brought some new symptoms with it.New symptoms observed in patients are a pain in the abdomen, loose motion, sudden headache, Conjunctivitis and brain fog. And few patients reported auditory and vestibular problems as other symptoms. We should always remember the old symptoms: fever, muscle pain or body ache, loss of smell and taste, sudden chills, breathlessness, extreme fatigue, painful sore throat, etc. If you ever experience any of these symptoms please reach out to hospitals for help. The country is bewildered with 1,761 COVID deaths in a single day.',
    },
    {
      date: '30-04-2021',
      content:
        'There is a shortage of oxygen in Delhi hospitals and Delhites are struggling to survive amidst the attack of the second wave of Coronavirus. People are rushing towards Punjab to look for beds and oxygen cylinders. As there are no beds and oxygen cylinders in the capital to meet the rising demand.',
    },
    {
      date: '30-04-2021',
      content:
        'Sikhs come as rescuers for the Delhi people struggling for oxygen. Khalsa Aid has declared to provide free oxygen concentrators to people with low oxygen levels. There is online registration for this to avoid any physical contact and people with the lowest oxygen level will be attended on a priority basis. They have to attach their medical prescription and a picture of oximeter readings will be needed along with other formalities and a concentrator will be issued for a week. Please feel free to contact Khalsa Aid in case of need of oxygen.',
    },
  ];

  constructor(
    public apiservice: ApiService,
    public toastr: ToastrService,
    public config: Config
  ) {
    this.currentPageUrl = this.config.appUri + '/covid-19';
  }

  ngOnInit(): void {

    this.getcovid();

    // $('ul.nav-tabs a').click(function (e: any) {
    //   e.preventDefault();
    // });
    // $('ul.nav-tabs a').click(function (this: any) {
    //   $(this).tab('show');
    // });
  }

  getcovid() {
    this.apiservice.getcovidListService().then(
      (res: any) => {
        this.coviddata = res;
        this.config.dismissLoading();
      },
      (err) => {
        console.log('error encountered: ', err); 
      }
    );
  }

  ngAfterViewInit() {
    $('.news').bootstrapNews({
      newsPerPage: 3,
      autoplay: true,
      pauseOnHover: true,
      direction: 'up',
      newsTickerInterval: 6000,
    });

    $('.slider-thumb').slick({
      horizontal: true,
      infinite: true,
      horizontalSwiping: true,
      slidesPerRow: 5,
      slidesToShow: 5,
      asNavFor: '.slider-preview',
      focusOnSelect: true,
      prevArrow:
        '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
      nextArrow:
        '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
      responsive: [
        {
          breakpoint: 767,
          settings: {
            horizontal: true,
            slidesPerRow: 3,
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 479,
          settings: {
            horizontal: true,
            slidesPerRow: 2,
            slidesToShow: 2,
          },
        },
      ],
    });
    $('.slider-preview').slick({
      vertical: true,
      infinite: true,
      slidesPerRow: 1,
      slidesToShow: 1,
      asNavFor: '.slider-thumb',
      arrows: false,
      draggable: false,
    });
  }
}
