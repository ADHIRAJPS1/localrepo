import { AlertModelBoxComponent } from './../alert-model-box/alert-model-box.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  PLATFORM_ID,
  Inject,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { AppAuth } from 'src/app/services/app-auth.service';
import { Config } from 'src/app/services/config';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';

@Component({
  selector: 'campaign-donate',
  templateUrl: './campaign-donate.component.html',
  styleUrls: ['./campaign-donate.component.css'],
})
export class CampaignDonateComponent implements OnInit {
  @Output() notifyParent = new EventEmitter<number>();
  @Output() notifyHeader = new EventEmitter<boolean>();
  public donateForm: FormGroup;
  submittedStep1 = false;
  submittedStep2 = false;
  @Input() redirectionUrl: any = '';
  @Input() campaignid: any = '';
  @Input() allowDonation: any = true;
  usrId: any;
  getUserData: any = {};
  parseUserData: any = {};
  public status: any;
  empcodeName: any;
  defaultEmpCode = '00000';
  btnDisabled = false;
  btnDisabledTrue = false;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  showDonationModalBox: any = 'hide';
  transactionselected: any;
  showSpinner: boolean = false;

  constructor(
    private _router: Router,
    private formBuilder: FormBuilder,
    public auth: AppAuth,
    private route: ActivatedRoute,
    private mdlService: NgbModal,
    public config: Config,
    public api_service: ApiService,
    public toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any
  ) {
    this.getUserData = localStorage.getItem('user_GlobalCure');
    this.parseUserData = JSON.parse(this.getUserData);
    this.usrId = auth.currentUser?.userId;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.status = { ...params.keys, ...params };

      if (this.status.params.paymentmsg) {
        const modalRef = this.mdlService.open(AlertModelBoxComponent);
        modalRef.componentInstance.message = this.status.params.paymentmsg;
      }
    });

    this.donateForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      pancardnumber: ['', [Validators.pattern('^[a-zA-Z0-9]{10,10}$')]],
      paymentmethod: ['', [Validators.required]],
      employeecode: [''],
      transactionid: '',
      checked: [false, Validators.required],
    });

    if (this.allowDonation == false || this.allowDonation == 'false') {
      this.allowDonation = false;
      setTimeout(() => this.donateForm.disable(), 2000);
    } else {
      this.allowDonation = true;
    }
  }

  get f() {
    if (!this.donateForm.value.checked) {
      this.donateForm.controls['checked'].setErrors({ required: true });
    } else {
      this.donateForm.controls['checked'].setErrors({ required: false });
    }
    return this.donateForm.controls;
  }

  ngAfterViewInit() {
    //this.donateForm.controls.contact.setValue('');
  }

  donationModalBox(s: any) {
    if (s && s == 'show') {
      if (this.donateForm.get('amount')?.value > 1) {
        let hh = this.document.getElementById('pgcheader');
        if (hh) {
          if (hh.classList.contains('sticky')) {
            // hh.classList.remove('sticky');
          } else {
            hh.classList.add('sticky');
          }
        }
        this.showDonationModalBox = 'show';
      } else {
        this.submittedStep1 = true;
        if (this.donateForm.get('amount')?.value > 0) {
          this.donateForm.controls['amount'].setErrors({ min: true });
        } else {
          this.donateForm.controls['amount'].setErrors({ required: true });
        }
        this.showDonationModalBox = 'hide';
      }
    } else {
      this.showDonationModalBox = 'hide';
    }
  }

  setAmount(a: number) {
    this.donateForm.controls.amount.setValue(a);
  }

  onSubmitDonation() {
    this.submittedStep2 = true;

    if (this.donateForm.invalid) {
      return;
    } else {
      this.submittedStep2 = false;
      let params = this.donateForm.value;
      params.employeeid = this.usrId
        ? this.usrId
        : '00000000-0000-0000-0000-000000000000';
      params.orderid = 'order_' + new Date().getTime();
      params.phonenumber = params.contact.e164Number;
      params.currencycode = 'INR';
      params.paymenttype = 'Paytm';
      params.donationtype = 'Direct';
      params.transactionid = 'Null';
      params.status = 'TXN_SUCCESS';
      params.paymenttype = 'paytm';
      let defaultUrl = this.config.appUri + '/donate';
      params['firstname'] = this.donateForm.get('firstname')?.value;
      params['lastname'] = this.donateForm.get('lastname')?.value;
      params['email'] = this.donateForm.get('email')?.value;
      params['amount'] = this.donateForm.get('amount')?.value;
      params['employeecode'] = this.empcodeName;
      params['redirectionUrl'] = this.redirectionUrl
        ? this.redirectionUrl
        : defaultUrl;
      params['campaignid'] = this.campaignid;
      // params['contact'] = encodeURIComponent(this.donateForm.get('contact')?.value.replace(/\s/g, ''));

      let UserDataURL = `https://api.hwcindia.org/payments/initpayment/v0?amount=${params['amount']}&email=${params['email']}&employeeid=${params['employeeid']}&employeecode=${params['employeecode']}&phone=${params['phonenumber']}&firstName=${params['firstname']}&lastName=${params['lastname']}&src=PGC&&campaignid=${params['campaignid']}&donationtype=campaign&hidedetails=false&redirectionUrl=${params['redirectionUrl']}`;

      this.donateForm.reset();
      this.donateForm.controls.contact.setValue('');
      this.showDonationModalBox = 'hide';
      window.open(UserDataURL);
    }
  }

  transactionSubmitPOS() {
    this.submittedStep2 = true;
    if (this.donateForm.invalid) {
      return;
    } else {
      this.submittedStep2 = false;
      this.showSpinner = true;
      this.EmpCodeAdd();
      let params = this.donateForm.value;
      params.employeeid = this.usrId
        ? this.usrId
        : '00000000-0000-0000-0000-000000000000';
      params.campaignid = this.campaignid;
      params.orderid = 'order_' + new Date().getTime();
      params.phonenumber = params.contact.e164Number;
      params.currencycode = 'INR';
      params.paymenttype = 'Paytm';
      params.donationtype = 'Direct';
      params.status = 'TXN_SUCCESS';
      params.paymenttype = 'paytm';
      params['employeecode'] = this.empcodeName;

      this.api_service.Donation(this.donateForm.value).then(
        (data) => {
          this.showSpinner = false;
          this.notifyParent.next(Number(params.amount));
          this.toastr.success(data.message);
          this.donateForm.reset();
          this.showDonationModalBox = 'hide';
          this.donateForm.controls.contact.setValue('');
        },
        (err) => {
          this.showSpinner = false;
          this.toastr.error(err.title, err.detail);
        }
      );
    }
  }

  numericOnly(evt: any) {
    var theEvent = evt;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]/;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  EmpCodeAdd() {
    let empcode = this.donateForm.get('employeecode').value;
    let e = this.config.empCodeList;
    let t = e.includes(empcode);
    if (t == true) {
      this.empcodeName = empcode;
    } else if (t == false) {
      this.empcodeName = '00000';
    }
  }

  addValidator() {
    this.donateForm.controls['employeecode'].setAsyncValidators([
      this.isValidNameNotInList(),
    ]);
  }

  isValidNameNotInList(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      let bReturn: boolean = true;
      let empcode = this.donateForm.get('employeecode').value;
      if (this.donateForm.controls['employeecode'].value == empcode) {
        bReturn = false;
      }
      let err: ValidationErrors = { exists: true };
      return bReturn ? of(null) : of(err);
    };
  }

  ontransactionChange() {
    this.transactionselected = this.donateForm.get('paymentmethod').value;
    if (this.transactionselected == 'pos') {
      this.document.getElementById('payment_pos').style.display = 'block';
      this.donateForm.get('transactionid').setValidators([Validators.required]);
      this.donateForm.get('transactionid').updateValueAndValidity();
    } else {
      this.document.getElementById('payment_pos').style.display = 'none';
      this.donateForm.get('transactionid').clearValidators();

      //this.donateForm.get('paymentmethod').patchValue(this.transactionselected);
      this.donateForm.get('transactionid').updateValueAndValidity();
    }
  }
}
