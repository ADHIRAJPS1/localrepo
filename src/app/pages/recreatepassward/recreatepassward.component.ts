import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Config } from "src/app/services/config";
import { MustMatch } from "src/app/shared/app-validators";
import { AppAuth } from "../../services/app-auth.service";

@Component({
    selector: "app-recreatepassward",
    templateUrl: "./recreatepassward.component.html",
    styleUrls: ["./recreatepassward.component.css"],
})
export class RecreatepasswardComponent implements OnInit {
    recreateForm: FormGroup;
    submitted = false;
    isToken = true;
    tokenId: any;
    isSuccessMsg = false;
    isErrorMsg = false;
    userId: any;

    constructor(public formBuilder: FormBuilder, public toastr: ToastrService, public auth: AppAuth, private route: ActivatedRoute,
        public router: Router, public config: Config) {
        this.route.queryParams.subscribe((params) => {
            this.tokenId = params["tokenid"];
        });
    }

    ngOnInit(): void {
        this.tokenvalidate();
        this.recreateForm = this.formBuilder.group(
            {
                newpassword: ["", Validators.required],
                confirmpassword: ["", Validators.required],
            },
            { validators: [MustMatch('newpassword', 'confirmpassword'), MustMatch('confirmpassword', 'newpassword')] }
        );
        this.config.dismissLoading();
    }

    get f() {
        return this.recreateForm.controls;
    }

    resetPass() {
        this.submitted = true;

        if (this.recreateForm.valid) {
            this.config.showLoading();

            let params = this.recreateForm.value;
            params["userid"] = this.userId; // never add to hidden fields, security issue

            this.auth.resetPassword(params).then(
                (res: any) => {
                    this.config.dismissLoading();
                    this.toastr.success(res.message);
                    this.recreateForm.reset();
                    this.submitted = false;
                    this.router.navigate(['/login']);
                },
                (err) => {
                    this.config.dismissLoading();
                    this.toastr.error(err.title, err.detail);
                }
            );
        }
    }

    tokenvalidate() {
        let cObj = {
            tokenid: this.tokenId,
            validationpurpose: "ResetPassword",
        };

        this.auth.emailverify(cObj).then(
            (res: any) => {
                this.isSuccessMsg = true;
                this.userId = res.userid;

                setTimeout(() => {
                    this.isToken = false;
                }, 2000);

                this.recreateForm.patchValue({
                    userid: this.userId,
                });
            },
            (err) => {
                this.isErrorMsg = true;
            }
        );
    }
}
