import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'src/app/services/config';
import demodata from '../../../assets/countries.json';

declare var $: any;

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css'],
})
export class ContactusComponent implements AfterViewInit {
  registerForm: FormGroup;
  data: any = {};
  public countries: any = demodata;
  registerForm1: any;
  captchaElem: any;
  submitted: any;
  defaultCounrty = 'India';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public http: HttpClient,
    public apiService: ApiService,
    public config: Config
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      phonenumber: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z.0-9._%+-]+@[a-zA-Z.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
      address: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      subject: ['', Validators.required],
    });

    this.data = {};
    this.data.name = '';
    this.data.email = '';
    this.data.description = '';
    this.data.phonenumber = '';
    this.data.country = '';
    this.data.address = '';
    this.data.subject = '';
    this.http = http;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if ($) {
      $('.phone').intlTelInput({
        preferredCountries: ['in'],
        separateDialCode: true,
      });
      this.config.dismissLoading();
    }
  }

  numericOnly(evt: any) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]/;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      let params = this.registerForm.value;
      params['name'] =
        this.registerForm.get('firstName')?.value +
        ' ' +
        this.registerForm.get('lastName')?.value;
      params.phonenumber = params.phonenumber.replace(/\s/g, '');

      delete params['firstName'];
      delete params['lastName'];

      this.apiService.postContact(params).then(
        (data) => {
          this.toastr.success(data.message);
          this.registerForm.reset();
          this.submitted = false;
        },
        (err) => {
          console.log('error encountered: ', err);
        }
      );
    } else {
      return;
    }
  }
}
