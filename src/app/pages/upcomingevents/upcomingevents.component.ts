import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'app-upcomingevents',
  templateUrl: './upcomingevents.component.html',
  styleUrls: ['./upcomingevents.component.css']
})
export class UpcomingeventsComponent implements OnInit {

  events: any[] = [];
  isloadMoreBtn: boolean = true;

  options: any = {
    limit: 6,
    offset: 0,
    pageno: 1,
    total: 0
  }

  constructor(
    public apiservice: ApiService,
    public toastr: ToastrService,
    public config: Config
  ) { }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.config.showLoading();
    this.apiservice.getEventListService(this.options.limit, this.options.pageno).then((events: any) => {
      let data = events.list;
      this.events = [...this.events, ...data];
      this.options = events.options;
      this.isloadMoreBtn = (this.options.total > this.events.length) ? true : false;
      this.config.dismissLoading();
    },
      (err) => {
        this.config.dismissLoading();
        console.log('error encountered: ', err);
      });
  }

  loadNextPageData() {
    if (this.options.total > this.events.length) {
      this.options.pageno++;
      this.getEvents();
    }
    else {
      this.isloadMoreBtn = false;
    }
  }
}
