import {
  Component,
  OnInit,
  ViewChild,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment-timezone';
import { AppAuth } from '../../services/app-auth.service';
import { MustMatch } from 'src/app/shared/app-validators';
import { Config } from 'src/app/services/config';
import { isPlatformBrowser } from '@angular/common';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
//declare var $: any;

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.css'],
})
export class VolunteerComponent implements OnInit {
  volunteerForm: FormGroup;
  pattern: RegExp =
    /^( )*([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})( )*$/;
  submitting: boolean = false;
  @ViewChild('closemodal') closemodal;
  DGender = 'Male';
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  constructor(
    public formBuilder: FormBuilder,
    public auth: AppAuth,
    public toastr: ToastrService,

    public config: Config,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.volunteerForm = this.formBuilder.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(this.pattern),
          ],
        ],
        password: ['', Validators.required],
        // confirmPassword: ['', Validators.required],
        phonenumber: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(14),
          ],
        ],
        gender: ['', Validators.required],
      },
      // {
      //   validators: [
      //     MustMatch('password', 'confirmPassword'),
      //     MustMatch('confirmPassword', 'password'),
      //   ],
      // }
    );
  }
  get f() {
    return this.volunteerForm.controls;
  }
  ngAfterViewInit() {
   // if (isPlatformBrowser(this.platformId)) {
   //   $('#phone').intlTelInput({
   //     preferredCountries: ['in'],
   //     separateDialCode: true,
   //   });
   // }
  }
  volunteerSubmit() {
    this.submitting = true;
    if (this.volunteerForm.valid) {
      let u = this.volunteerForm.value;
      u.phonenumber = u.phonenumber.e164Number;
     // u.phonenumber = u.phonenumber.replace(/\s/g, ''); // no spaces are accepted in the API
      u['timezone'] = moment.tz.guess();
      u['role'] = 'volunteer';
      u['additionaldata'] = {};
      //console.log(u);
      this.auth.register(u).then(
        (data) => {

          this.toastr.success(data.message);
          this.closemodal.nativeElement.click();
          this.volunteerForm.reset();
          this.submitting = false;
          this.config.dismissLoading();
        },
        (err) => {
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
}
