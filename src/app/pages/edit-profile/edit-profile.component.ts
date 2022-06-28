import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { AppAuth } from 'src/app/services/app-auth.service';
import { Component, OnInit, Input, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
//declare var $: any;

import { Config } from 'src/app/services/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  submitted = false;
  useredit: FormGroup;

  userid: any;

  pattern: RegExp =
    /^( )*([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})( )*$/;
  usrId: any;
  usrDetails: any = {};
  imageurl: any = '';
  base64code: string | null;
  maxDateDOB: any = new Date();
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public config: Config,
    private auth: AppAuth,
    private apiService: ApiService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.usrId = auth.currentUser?.userId;
    this.maxDateDOB.setFullYear(this.maxDateDOB.getFullYear() - 18);
    this.maxDateDOB = this.formatDate(this.maxDateDOB);
  }
  ngAfterViewInit() {
   // if (isPlatformBrowser(this.platformId)) {
   //   $('.contact').intlTelInput({
   //     preferredCountries: ['in'],
   //     separateDialCode: true,
   //   });
   // }
  }

  ngOnInit(): void {
    this.useredit = this.formBuilder.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
        ],
      ],
      middlename: [''],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(50),
          Validators.pattern(this.pattern),
        ],
      ],
      phonenumber: [
        '',
        [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13),
        ],
      ],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalcode: ['', [Validators.required]],
      base64code: [''],
    });
    this.useredit.disable();
    //this.getUserDetails();
    this.userid = this.auth.currentUser.userId;
    if (this.auth.usrDetails && this.auth.usrDetails.firstname) {
      this.usrDetails = this.auth.usrDetails;
      this.useredit.enable();
    } else {
      this.getUserDetails();
    }
  }

  get f1() {
    return this.useredit.controls;
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  getUserDetails() {
    let header = {
      Authorization: 'Bearer ' + this.auth.currentUser.authToken,
    };
    this.apiService.getuserDetails(this.usrId, header).then(
      (d: any) => {
        this.usrDetails = d.user;
        if (this.usrDetails.profilepic) {
          this.usrDetails.profilepic =
            this.usrDetails.profilepic + '?timestamp=' + Date.now();
        }
        this.useredit.enable();
        this.auth.usrDetails = this.usrDetails;
        //console.log(this.usrDetails);
      },
      (err) => {
        console.log('error encountered', err);
      }
    );
  }

  usersubmit() {
    this.submitted = true;
    let params = this.useredit.value;
    params.userid = this.usrId;
    if (this.useredit.valid) {
      this.useredit.disable();
      this.apiService.postUserUpdate(params).then(
        (data) => {
          this.toastr.success(data.message);
          // this.useredit.reset();
          //this.ngOnInit();
          //this.getUserDetails();
          let keys = Object.keys(params);
          //console.log(this.auth.usrDetails, keys);
          if (keys && keys.length > 0) {
            keys.forEach((k) => {
              this.auth.usrDetails[k] = params[k];
            });
          }

          this.submitted = false;
          this.router.navigateByUrl('/profile');
        },
        (err) => {
          this.submitted = false;
          this.toastr.error(err.detail);
          this.useredit.enable();
          console.log('error encountered: ', err);
        }
      );
    } else {
      return;
    }
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => {
        // called once readAsDataURL is completed
        this.base64code = event.target.result;
        let params = (reader.result as string).replace(/^.+?;base64,/, '');

        this.auth.uploadMediaProfile(this.userid, params).then(
          (data: any) => {
            this.imageurl = data.url;
            this.auth.currentUser.profilePic =
              data.url + '?timestamp=' + Date.now();
          },
          (error) => {
            console.log(error);
          }
        );
      };
    }
  }

  public delete() {
    this.base64code = null;
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

  backToProfile() {
    this.router.navigateByUrl('/profile');
  }
}
