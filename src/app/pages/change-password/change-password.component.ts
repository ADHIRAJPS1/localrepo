import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppAuth } from 'src/app/services/app-auth.service';
import { Config } from 'src/app/services/config';
import { MustMatch } from 'src/app/shared/app-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  submitted = false;
  userid: any;
  UserData: any;
  constructor(
    public formBuilder: FormBuilder,
    public toastr: ToastrService,
    public auth: AppAuth,
    public config: Config,
    public router: Router
  ) {
    this.UserData = JSON.parse(localStorage.getItem('user_GlobalCure'));
    this.userid = this.UserData.userId;
  }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group(
      {
        newpassword: ['', Validators.required],
        confirmpassword: ['', Validators.required],
      },
      {
        validators: [
          MustMatch('newpassword', 'confirmpassword'),
          MustMatch('confirmpassword', 'newpassword'),
        ],
      }
    );
  }
  get f() {
    return this.changePasswordForm.controls;
  }
  ChangePassword() {
    this.submitted = true;

    if (this.changePasswordForm.valid) {
      this.config.showLoading();

      let params = this.changePasswordForm.value;
      params['userid'] = this.userid; // never add to hidden fields, security issue

      this.auth.ChangePassword(params).then(
        (res: any) => {
          this.toastr.success(res.message);
          this.changePasswordForm.reset();
          this.submitted = false;
          this.router.navigate(['/login']);
        },
        (err) => {
          this.toastr.error(err.title, err.detail);
        }
      );
    }
  }
}
