import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './../../services/api.service';
import { Config } from 'src/app/services/config';
import { AppAuth } from '../../services/app-auth.service';

@Component({
  selector: 'app-campaignanonymoususer',
  templateUrl: './campaignanonymoususer.component.html',
  styleUrls: ['./campaignanonymoususer.component.css'],
})
export class CampaignanonymoususerComponent implements OnInit {
  startAFundraiserForm: FormGroup;
  step: number = 1;
  errStep1: boolean = false;
  errStep2: boolean = false;
  data: any = {};
  categories: Array<any> = [];
  slug: any;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public apiService: ApiService,
    public config: Config,
    public auth: AppAuth,
    private router: Router
  ) {
    this.startAFundraiserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      userFirstName: ['', Validators.required],
      userLastName: ['', Validators.required],
      title: ['', [Validators.required]],
      slug: ['', Validators.required],
      phonenumber: ['', Validators.required],
      categoryid: ['', Validators.required],
      userEmail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z.0-9._%+-]+@[a-zA-Z.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
    });
  }

  ngOnInit() {
    this.auth.getStoryCategories().then(
      (cats: any) => {
        if (this.auth.currentUser) {
          this.startAFundraiserForm.patchValue({
            userFirstName: this.auth.currentUser.firstName,
            userLastName: this.auth.currentUser.lastName,
            userEmail: this.auth.currentUser.email,
          });
        }
        this.categories = cats;
        this.startAFundraiserForm.patchValue({
          categoryid: cats[0].categoryid,
        });
      },
      (err: any) => {
        console.log('error encountered: ', err);
      }
    );
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.startAFundraiserForm.controls;
  }

  next() {
    let c = this.startAFundraiserForm.controls;
    if (c.userEmail.valid) {
      this.errStep1 = false; // no errors should display
      if (c.slug.valid) {
        this.newFundRaiser();
      } else {
        this.step = 2;
      }
    } else {
      this.errStep1 = true; // display step 1 errors
    }
  }

  previous() {
    if (this.step > 1) {
      this.step--;
    }
  }
  newFundRaiser() {
    let c = this.startAFundraiserForm.controls;
    let st = {
      name: c.name.value,
      userFirstName: c.userFirstName.value,
      userLastName: c.userLastName.value,
      userEmail: c.userEmail.value,
      title: c.title.value,
      slug: c.slug.value,
      phonenumber: c.phonenumber.value,
      categoryid: c.categoryid.value,
      status: 'pending',
    };

    this.apiService.startFundRPost(st).then(
      (res: any) => {
        this.toastr.success(res.message);
        this.router.navigate(['/medical-support/' + c.slug.value]);
        this.startAFundraiserForm.reset();
      },
      (err: any) => {
        this.toastr.error(err.title, err.detail);
      }
    );
  }
}
