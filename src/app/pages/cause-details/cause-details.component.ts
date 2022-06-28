import { AlertModelBoxComponent } from './../../components/alert-model-box/alert-model-box.component';
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Config } from 'src/app/services/config';
import { Meta, Title, DomSanitizer } from '@angular/platform-browser';
import { AppAuth } from 'src/app/services/app-auth.service';
import AOS from 'aos';
import { DOCUMENT } from '@angular/common';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-cause-details',
  templateUrl: './cause-details.component.html',
  styleUrls: ['./cause-details.component.css'],
})
export class CauseDetailsComponent implements OnInit {
  @ViewChild('StoryData') StoryData: any;
  @ViewChild('closeModal') closeModal: ElementRef;
  storyForm: FormGroup;
  storyAmountForm: FormGroup;
  storyTabForm: FormGroup;
  public relatedStoriesData: any[];
  public storyData: any;
  public storyslug: any;
  public currentPageUrl: string = '';
  public stories: any;
  public donationList: any[] = [];
  public classToggled = false;
  public toggleField() {
    this.classToggled = !this.classToggled;
  }
  EditTitle = false;
  EditfImage = false;
  EditStory = false;
  currentdata: any;
  youtubeurl: string = '';
  submitted = false;
  isloadMoreBtn = true;
  allowDonation: boolean = true;
  disableSubmitBtn: boolean = false;
  supportCampaignModalBox: any = 'hide';
  temp: any = {};
  columnLayout: any = 'col-md-7';
  fundRaisedPer: any = 0;

  options: any = {
    limit: 10,
    offset: 0,
    pageno: 1,
    search: '',
    total: 0,
    status: '',
  };

  donationOptions: any = {
    limit: 10,
    offset: 0,
    pageno: 1,
    total: 0,
    stid: '',
    status: 'completed',
  };
  getUserData: any = {};
  parseUserData: any = {};
  fieldexecutiveSubmitted = false;
  fieldexecutiveForm: FormGroup;
  childData: any = { name: null, slug: null, story: null, stid: null };
  modalReference = null;
  showYouTubeUrl: any = null;
  successstories: any = [];
  successoptions: any = {
    limit: 7,
    offset: 0,
    pageno: 1,
    search: '',
    total: 0,
    categoryname: '',
    status: 'completed',
  };

  constructor(
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    public apiService: ApiService,
    private route: ActivatedRoute,
    public config: Config,
    public _router: Router,
    public auth: AppAuth,
    private title: Title,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: any
  ) {
    this.getUserData = localStorage.getItem('user_GlobalCure');
    this.parseUserData = JSON.parse(this.getUserData);
    //console.log('user_GlobalCure', this.parseUserData);
    this.storyslug = this.route.snapshot.paramMap.get('storyslug');
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.fieldexecutiveForm.controls;
  }

  ngOnInit() {
    this.fieldexecutiveForm = this.formBuilder.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      cloneDesstory: [''],
    });
    AOS.init({
      duration: 600,
    });
    this._router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.getStoryEditData();
    this._router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this._router.navigated = false;
      }
    });

    if (this.storyslug.length > 0) {
      this.currentdata = this.route.snapshot.data.story;
      this.storyData = this.route.snapshot.data.story.story;

      if (this.storyData.status == 'completed') {
        this.columnLayout = 'col-md-7';
        this.allowDonation = false;
      }

      if (
        this.storyData &&
        (this.storyData.status == 'draft' ||
          this.storyData.status == 'published' ||
          this.storyData.status == 'completed')
      ) {
        //VALID STORY SLUG
      } else {
        this._router.navigate(['/medical-support']);
      }
      this.donationOptions.stid = this.storyData.stid;
      this.title.setTitle(
        this.storyData?.title
          ? this.storyData?.title
          : 'Project Global Cure - Transforming The Health Sector - PGC.'
      );
      this.donationOptions.status = this.storyData.status;
      this.relatedStoriesData = [];
      //console.log(this.storyData);
      this.currentPageUrl = this.document.location.href;
    } else {
      this.config.dismissLoading();
    }
    this.storyForm = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(50),
          Validators.maxLength(125),
        ],
      ],
      categoryid: ['', Validators.required],
    });
    this.storyAmountForm = this.formBuilder.group({
      targetamount: ['', Validators.required],
      categoryid: ['', Validators.required],
    });
    this.storyTabForm = this.formBuilder.group({
      story: ['', Validators.required],
      categoryid: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.calculateDonationPer();
    if (this.storyData && this.storyData.youtubeurl) {
      this.showYouTubeUrl =
        'https://www.youtube.com/embed/' +
        this.storyData.youtubeurl
          .replace('https://youtu.be', '')
          .replace('https://www.youtube.com', '')
          .replace('watch?v=', '')
          .replace('/', '') +
        '?controls=1&loop=1&rel=0';
      /*this.showYouTubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.showYouTubeUrl
      );*/
      //console.log(this.showYouTubeUrl);
    }

    if (this.storyData.status == 'draft') {
      setTimeout(() => {
        this._router.navigate(['/medical-support']);
      }, 120000); //120s
    }
  }

  othermedicalcases: OwlOptions = {
    loop: true,
    items: 3,
    margin: 30,
    autoplay: true,
    nav: false,
    autoplayTimeout: 8500,
    smartSpeed: 450,
    navText: [
      '<i class="fa fa-arrow-left"></i>',
      '<i class="fa fa-arrow-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1170: {
        items: 3,
      },
    },
  };

  notifyParent(amountAdded: number) {
    this.storyData.fundraised =
      Number(this.storyData.fundraised) + Number(amountAdded);
    this.calculateDonationPer();
  }

  calculateDonationPer() {
    const rangeV = this.document.getElementById('rangeV');
    let newValue: any = 0;
    if (this.storyData?.fundraised && this.storyData?.targetamount) {
      newValue = Number(
        (this.storyData?.fundraised * 100) / this.storyData?.targetamount
      );
    }
    newValue = Number(
      Math.round(newValue * Math.pow(10, 6)) / Math.pow(10, 6)
    ).toFixed(2);
    newValue = newValue > 0 ? newValue : 0;
    if (newValue > 0) {
      if (newValue > 1) {
        newValue = Number(
          Math.round(newValue * Math.pow(10, 6)) / Math.pow(10, 6)
        ).toFixed(2);
      }
    } else {
      newValue = 0;
    }
    this.fundRaisedPer = newValue;
    const newPosition = 10 - newValue * 0.2;
    if (rangeV) {
      //rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
      rangeV.style.left = `calc(${newValue}%)`;
    }
  }

  updateTitle() {
    let c = this.storyForm.controls;
    let title = this.storyForm.get('title').value;
    const UpdateData = {
      title: title,
      categoryid: this.storyData.categoryid,
      status: 'pending',
    };
    this.auth.updateStoryByStid(this.storyData.stid, UpdateData).then(
      (res: any) => {
        this.toastr.success(res.message);
      },
      (err: any) => {
        this.toastr.error(err.title, err.detail);
      }
    );
  }
  updateAmount() {
    let amnt = this.storyAmountForm.controls;
    let targetamount = this.storyAmountForm.get('targetamount').value;
    const UpdateAmountData = {
      targetamount: targetamount,
      categoryid: this.storyData.categoryid,
      //targetcurrency:"INR",
      status: 'pending',
    };
    this.auth.updateStoryByStid(this.storyData.stid, UpdateAmountData).then(
      (res: any) => {
        this.toastr.success(res.message);
      },
      (err: any) => {
        this.toastr.error(err.title, err.detail);
      }
    );
  }
  updateFImage() {
    const UpdateFImageData = {
      featuredimage: this.temp.featuredimage,
      categoryid: this.storyData.categoryid,
      status: 'pending',
    };
    this.auth.updateStoryByStid(this.storyData.stid, UpdateFImageData).then(
      (res: any) => {
        this.toastr.success(res.message);
      },
      (err: any) => {
        this.toastr.error(err.title, err.detail);
      }
    );
  }
  updateStory() {
    let st = this.storyTabForm.controls;
    const UpdateStoryObj = {
      story: st.story.value,
      categoryid: this.storyData.categoryid,
    };
    this.auth.updateStoryByStid(this.storyData.stid, UpdateStoryObj).then(
      (res: any) => {
        this.toastr.success(res.message);
      },
      (err: any) => {
        this.toastr.error(err.title, err.detail);
      }
    );
  }

  handleInputChange(f) {
    this.config.showLoading();

    if (f.base64url && f.base64url.length > 0) {
      let sub = 'data:' + f.type + ';base64,';
      let url = f.base64url.replace(sub, '');
      let mediafor = 'featured';
      this.auth
        .uploadMediaStories(this.storyData.stid, f.name, url, mediafor)
        .then(
          (res: any) => {
            if (res && res.url && res.url.length > 0) {
              this.temp.featuredimage = res.url;
            }

            this.config.dismissLoading();
          },
          (err: any) => {
            this.config.dismissLoading();
          }
        );
    }
  }

  private getStoryEditData() {
    if (this.StoryData && this.StoryData.editorInstance) {
      return this.StoryData.editorInstance.getData();
    }
    return '';
  }

  open(content: any) {
    if (this.parseUserData && this.parseUserData.authToken) {
      this.createSupportCampaign(content);
    } else {
      this.toastr.success('Token Expired, Please Try to Re-Login!');
    }
  }

  onSubmitFieldExecutive() {
    // let fieldE = this.fieldexecutiveForm.controls;
    let name = this.childData.name
      ? this.childData.name
      : this.fieldexecutiveForm.get('name').value;
    let slug = this.childData.slug
      ? this.childData.slug
      : this.fieldexecutiveForm.get('slug').value;
    let cloneDesstory = this.childData.story
      ? this.childData.story
      : this.fieldexecutiveForm.get('cloneDesstory').value;
    const feldExecutiveData = {
      name: name,
      slug: slug,
      story: cloneDesstory,
      organizationid: this.childData.organizationid,
      categoryid: this.childData.categoryid,
      title: this.childData.title,
      featuredimage: this.childData.featuredimage,
      parentid: this.childData.parentid,
      youtubeurl: null,
      successstory: null,
      report: this.storyData.report,
      targetdate: this.storyData.targetdate,
      targetamount: this.storyData.targetamount,
      targetcurrency: 'INR',
      stid: this.childData.stid,
      status: 'published',
    };
    this.disableSubmitBtn = true;
    this.auth.updateStoryByStidWithout(feldExecutiveData, null).then(
      (res: any) => {
        this.disableSubmitBtn = false;
        this.supportCampaignModalBox = 'hide';
        //console.log(res);
        //this.closeModal.nativeElement.click();
        //this.modalService.open(AlertModelBoxComponent, { size: 'md' });
        //this.toastr.success(res.message);
        this.toastr.success('Support Campaign Created!');
        this._router.navigate(['/medical-support/' + feldExecutiveData.slug]);
      },
      (err: any) => {
        this.disableSubmitBtn = false;
        this.toastr.error(err.title, err.detail);
      }
    );
  }

  createSupportCampaign(content: any) {
    let slug = this.storyData.slug.replace(/pgc-/g, '');
    let child = {
      name: this.storyData.name,
      slug: this.parseUserData.firstName.toLowerCase() + '-' + slug,
      stid: this.storyData.stid,
    };
    this.apiService.fieldexecutivePost(child, null).then(
      (res: any) => {
        this.childData = res.story;
        console.log('res.story', res.story);
        /*let ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          windowClass: 'custom-class',
        };
        this.modalService.open(content, ngbModalOptions);*/
        this.supportCampaignModalBox = 'show';
      },
      (err: any) => {
        this.toastr.error(err.title, err.detail);
      }
    );
  }

  getsuccessStoriesList() {
    this.apiService
      .getStoriesListService(
        this.successoptions.limit,
        this.successoptions.pageno,
        this.successoptions.search,
        this.successoptions.status,
        this.successoptions.categoryname
      )
      .then(
        (story: any) => {
          let listArr = story.list.length > 0 ? story.list : [];
          this.successstories = listArr.filter(
            (a: any) => a.stid != this.storyData.stid
          );
          //console.log(this.storyData, listArr, this.successstories);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  closeSupportCampaignModalBox() {
    this.supportCampaignModalBox = 'hide';
    console.log(this.supportCampaignModalBox);
  }
}
