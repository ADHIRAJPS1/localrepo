import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppAuth } from 'src/app/services/app-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { Observable } from 'rxjs';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'referral-list',
  templateUrl: './referral-list.component.html',
  styleUrls: ['./referral-list.component.css'],
})
export class ReferralListComponent implements OnInit {
  //DONATIONS
  pageIndex: any = 1;
  referralList = {
    options: {
      limit: 10,
      pageno: 1,
      total: 0,
      offset: 0,
      search: '',
    },
    list: [],
  };
  showSpinner: boolean = false;
  temp: any = {};
  StatusForm: FormGroup;
  submitting: boolean = false;
  searchRefers: string = null;
  showLoader: boolean = false;

  constructor(
    private auth: AppAuth,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private config: Config,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.showSpinner = true;
    this.showLoader = true;
    this.StatusForm = this.formBuilder.group({
      status: ['', Validators.required],
    });
    this.getReferralList();
  }

  get f() {
    return this.StatusForm.controls;
  }

  getReferralList() {
    let header = {
      Authorization: 'Bearer ' + this.auth.currentUser.authToken,
    };
    this.auth
      .getReferredList(this.referralList.options, header)
      .then((d: any) => {
        this.showSpinner = false;
        this.showLoader = false;
        this.referralList.options = d.options;
        this.referralList.list = d.list;
        console.log(this.referralList);
        /*this.donations.list = [...this.referralList.list, ...d.list];
      this.referralList.list = this.referralList.list.filter(
        (v, i, a) => a.findIndex((v2) => v2.did === v.did) === i
      );*/
      })
      .catch((err: any) => {
        this.showSpinner = false;
        this.showLoader = false;
      });
  }

  clearSearch() {
    this.referralList.options.search = '';
    this.getReferralList();
  }

  public onPagination(page: any) {
    this.showLoader = true;
    this.getReferralList();
  }
  search() {
    this.showLoader = true;
    this.getReferralList();
  }

  setPageSize() {
    this.showLoader = true;
    this.getReferralList();
  }

  getModaldata(content: any, refers: any) {
    this.temp = refers;
    this.modalService.open(content, { size: 'lg', scrollable: false });
  }
  StatusModel(statusModel: any, status: any) {
    this.temp = status;
    this.StatusForm.patchValue({
      status: this.temp.status,
    });
    this.modalService.open(statusModel, { size: 'lg', scrollable: false });
  }

  updateStatus(status: any) {
    let s = this.StatusForm.controls;
    if (this.StatusForm.valid) {
      let st = this.StatusForm.value;
      st['srid'] = this.temp.srid;
      st['status'] = this.StatusForm.get('status').value;
      this.auth.updateReferredStatus(st).then(
        (data: any) => {
          this.toastr.success(data.message);
          this.StatusForm.reset();
          //console.log(status)
          this.config.dismissLoading();
          this.submitting = false;
        },
        (err: any) => {
          this.config.dismissLoading();
          this.toastr.error(err.title, err.detail);
          this.submitting = false;
        }
      );
    } else {
      return;
    }
  }
}
