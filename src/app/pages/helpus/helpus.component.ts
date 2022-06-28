import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/services/config';

//declare let $: any;

@Component({
  selector: 'app-helpus',
  templateUrl: './helpus.component.html',
  styleUrls: ['./helpus.component.css'],
})
export class HelpusComponent implements OnInit {
  public currentPageUrl: string = '';
  constructor(public config: Config) {
    this.currentPageUrl = this.config.appUri + '/donate';
  }

  ngOnInit(): void {
    // $('ul.nav-tabs a').click(function (e: any) {
    //   e.preventDefault();
    // });
    // $('ul.nav-tabs a').click(function (this: any) {
    //   $(this).tab('show');
    // });
    this.config.dismissLoading();
  }

  public searchInput: String = '';
  public searchResult: Array<any> = [];
  public toggle: Boolean = false;
  public selectedInput: any = {};
  public seriesList: Array<any> = [
    {
      name: 'Prison Break',
      description:
        "Structural Engineer Michael Scofield turns himself into the Fox River Penitentiary in order to break out his brother Lincoln Burrows, who is on death row for the murder of the Vice President's brother. But Lincoln was set up by some of the Company (an agency formed by corrupt government officials) guys, headed by General Jonathan Krantz. Michael breaks out from Fox River with his brother Lincoln and other convicts.",
      genres: 'Action, Crime, Drama, Mystery, Thriller',
      releaseDate: '29 August 2005 (USA)',
    },
    {
      name: 'Asdfd Break',
      description:
        "Structural Engineer Michael Scofield turns himself into the Fox River Penitentiary in order to break out his brother Lincoln Burrows, who is on death row for the murder of the Vice President's brother. But Lincoln was set up by some of the Company (an agency formed by corrupt government officials) guys, headed by General Jonathan Krantz. Michael breaks out from Fox River with his brother Lincoln and other convicts.",
      genres: 'Action, Crime, Drama, Mystery, Thriller',
      releaseDate: '29 August 2005 (USA)',
    },
    {
      name: 'Bbb Break',
      description:
        "Structural Engineer Michael Scofield turns himself into the Fox River Penitentiary in order to break out his brother Lincoln Burrows, who is on death row for the murder of the Vice President's brother. But Lincoln was set up by some of the Company (an agency formed by corrupt government officials) guys, headed by General Jonathan Krantz. Michael breaks out from Fox River with his brother Lincoln and other convicts.",
      genres: 'Action, Crime, Drama, Mystery, Thriller',
      releaseDate: '29 August 2005 (USA)',
    },
    //Truncated for brevity
  ];

  fetchSeries(value: String) {
    if (value === '') {
      return (this.searchResult = [] as any);
    }
    this.searchResult = this.seriesList.filter(function (series) {
      return series.name.toLowerCase().startsWith(value.toLowerCase());
    });
    this.toggle = false;
  }

  showDetails(series: any) {
    this.selectedInput = series;
    this.toggle = true;
    this.searchInput = series.name;
  }

  public selectOptions = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  public selectedOption = 'INR';
}
