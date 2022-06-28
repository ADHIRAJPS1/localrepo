import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAuth } from './../../services/app-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: any = false;
  returnUrl: string;
  showErrorMessage: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AppAuth
  ) {
    this.loginForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z.0-9._%+-]+@[a-zA-Z.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
      pwd: ['', [Validators.required]],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (localStorage.getItem('user')) {
      this.router.navigate(['/profile']);
    }
  }

  ngOnInit() {}

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      this.submitted = true;
      this.showErrorMessage = '';
      let password = this.loginForm.value.pwd.trim();
      let email = this.loginForm.value.username.trim();

      // trimmed length can differ from actual length
      if (password.length && email.length) {
        this.auth.login(email, password).then(
          (res) => {
            this.showErrorMessage = '';
            this.loginForm.reset();
            this.submitted = false;
            if (this.auth.currentUser?.roles[0] == 'campaignmanager') {
              this.router.navigate(['/profile']);
            } else if (this.auth.currentUser?.roles[0] == 'seoteamlead') {
              this.router.navigate(['/profile']);
            } else if (this.auth.currentUser?.roles[0] == 'helpdesklead') {
              this.router.navigate(['/profile']);
            } else {
              this.router.navigate(['/profile']);
            }
          },
          (err) => {
            this.submitted = false;
            this.showErrorMessage = err.detail;
            console.log('error encountered: ', err, this.showErrorMessage);
          }
        );
      }
    } else {
      return;
    }
  }
}
