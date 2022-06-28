import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppAuth } from '../../services/app-auth.service';
import { Config } from 'src/app/services/config';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-refers',
  templateUrl: './refers.component.html',
  styleUrls: ['./refers.component.css'],
})
export class RefersComponent implements OnInit {
  @ViewChild('closemodal') closemodal;
  data: any = {};
  res: any;
  public refersForm: FormGroup;
  fileToUpload: File;
  submitted = false;
  base64: any;
  filename: any;
  categories: Array<any> = [];
  Dcategory: string = 'Medical Cases';
  images: Array<any> = [];
  getImageArray: Array<any> = [];
  fileLengthErr = false;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public toastr: ToastrService,
    public auth: AppAuth,
    public config: Config,
    public apiService: ApiService
  ) {
    this.res = {};
    this.res.fullname = '';
    this.res.email = '';
    this.res.phonenumber = '';
    this.res.fullname = '';
    this.res.files = '';
  }
  ngOnInit() {
    this.refersForm = this.formBuilder.group({
      fullname: ['', Validators.required],
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
      casesummary: ['', Validators.required],
      categoryid: ['', Validators.required],
      files: ['', Validators.required],
      phonenumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(14),
        ],
      ],
    });

    this.auth.getStoryCategories().then(
      (cats: any) => {
        this.categories = cats;
        this.refersForm.patchValue({
          categoryid: cats[0].categoryid,
        });
      },
      (err: any) => {
      }
    );
  }

  get g() {
    return this.refersForm.controls;
  }
  onSubmitEnquiry() {
    let c = this.refersForm.controls;

    let b = {
      categoryid: c.categoryid.value,
      files: this.getImageArray,
      fullname: c.fullname.value,
      email: c.email.value,
      phonenumber: c.phonenumber.value,
      casesummary: c.casesummary.value,
    };
    this.apiService.referToUsPost(b).then(
      (res: any) => {
        this.refersForm.reset();
        this.closemodal.nativeElement.click();
        this.toastr.success(res.message);
        this.config.dismissLoading();
      },
      (err: any) => {
      }
    );
  }
  changeListener(event: any) {
    this.getImageArray = [];
    this.images = [];
    this.fileLengthErr = false;
    this.filename = '';
    if (event.target.files && event.target.files[0]) {
      var file = event.target.files.length;
      if (file < 6) {
        for (let i = 0; i < file; i++) {
          this.filename = event.target.files[i].name;
          var reader = new FileReader();
          reader.onloadend = (event) => {
            this.images.push(event.target.result);
            this.base64 = event.target.result;
            this.getImageArray.push({
              filename: this.filename,
              base64code: this.base64,
            });
          };
          reader.readAsDataURL(event.target.files[i]);
        }
      } else {
        this.filename = '';
        this.getImageArray = [];
        this.images = [];
        this.toastr.error('You can upload  only 5 images');
        this.fileLengthErr = true;
      }
    }
  }
}
