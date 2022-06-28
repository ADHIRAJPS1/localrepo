import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppAuth } from 'src/app/services/app-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css'],
})
export class DonationListComponent implements OnInit {
  //DONATIONS
  pageIndex: any = 1;
  donations = {
    options: {
      limit: 5,
      pageno: 1,
      total: 0,
      offset: 0,
      search: '',
    },
    list: [],
  };
  showSpinner: boolean = false;

  constructor(
    public auth: AppAuth,
    public toastr: ToastrService,
    fb: FormBuilder,
    public config: Config
  ) {}

  ngOnInit(): void {
    this.showSpinner = true;
    this.getDonationList();
  }
  getDonationList() {
    let header = {
      Authorization: 'Bearer ' + this.auth.currentUser.authToken,
    };
    this.auth.getDonationList(this.donations.options, header).then((d: any) => {
      this.showSpinner = false;
      this.donations.options = d.options;
      this.donations.list = d.list;
      console.log(this.donations);
      /*this.donations.list = [...this.donations.list, ...d.list];
      this.donations.list = this.donations.list.filter(
        (v, i, a) => a.findIndex((v2) => v2.did === v.did) === i
      );*/
    });
  }
  searchDonationList() {
    this.showSpinner = true;
    this.getDonationList();
  }
  clearSearch() {
    this.donations.options.search = '';
    this.getDonationList();
  }
  onDonationPagination(pageno: any) {
    this.donations.options.pageno = pageno;
    this.getDonationList();
  }
}
