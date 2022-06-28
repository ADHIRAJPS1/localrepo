import { ApiService } from 'src/app/services/api.service';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppAuth } from 'src/app/services/app-auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import demodata from '../../../assets/countries.json';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { isPlatformBrowser } from '@angular/common';
import { RegExpPatterns } from 'src/app/shared/app-validators';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Config } from 'src/app/services/config';

import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
//declare var $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  storyForm: FormGroup;
  step: number = 1;
  errStep1: boolean = false;
  errStep2: boolean = false;
  submitting: boolean = false;
  action: string = 'Add';
  temp: any = {};
  categories: Array<any> = [];
  successstory = false;
  successstorynon = true;
  selected = 'published';
  selectedTab = 'profile';
  selectedCat = '7f31715c-f13b-44c9-a19d-bb36da147f03';
  currentStatus: any = 'draft';
  displayName: string;
  patterns = new RegExpPatterns();
  stories = {
    options: {
      limit: 6,
      pageno: 1,
      total: 0,
      offset: 0,
      search: '',
      cslug: '',
      status: '',
    },
    list: [],
  };
  reportImg = [];
  users: any[] = [];
  usrId: any;
  usrDetails: any = {};
  defaultCounrty = 'India';
  isAdminRoles: boolean = false;
  showModalUpdateStoryBox: any = 'hide';
  showModalAddStoryBox: any = 'hide';

  data: Array<any> = [];
  filteredUsers: any[];
  story: any[] = [];
  filterBy: any;
  storycategory: any;
  search = '';
  categoryName: any;
  categoryid: any;
  catename: any;

  mindate: any;
  updateStoryEditForm: FormGroup;
  updateStoryMetaEditForm: FormGroup;
  statuscounts: any = [];
  idToBeDeleted = '';
  modalRef: BsModalRef;
  message: string;
  authtoken: any;
  statusList = [];
  countries: any = demodata;
  showSpinner: boolean = false;
  disableSubmitBtn: boolean = false;
  storyedit: any;
  category_id: any;
  story_id: any;
  organisation_id: any;
  author_id: any;
  category_name: any;
  featured_img: any;
  fundraiser: any[] = [];
  options: any = {
    limit: 0,
    pageno: 1,
    userid: this.auth.currentUser?.userId,
    categoryname: '',
    search: '',
    total: 0,
  };
  isFirstTimeLoadingStoriesList: boolean = true;
  public base64code: any;
  stid: any;
  featured_image: any;
  public urls: string[] = [];
  supportingDoc: any;
  seoTeamRoles: any = ['seoteamlead', 'seoteam'];
  deletionType: any = 'disable';
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India];
  optradioenable: any = 'published';

  //BLOGS VARIABLES
  blogsStatus: any = [];
  blogs: any = {};
  selectedBlogStatus = 'published';
  filterBlogBy: string = null;
  blogForm: FormGroup;
  blogCategories: Array<any> = [];
  selectedBlogCategory: any = 'Category';
  showBlogModalBox: any = 'hide';
  blogAction: any = 'Edit';
  selectedBlog: any = {};

  constructor(
    public auth: AppAuth,
    private apiService: ApiService,
    public router: Router,
    public toastr: ToastrService,
    public _formBuilder: FormBuilder,
    private modalService: BsModalService,
    private modalSrv: NgbModal,
    public config: Config,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.usrId = auth.currentUser?.userId;
    this.statusList = this.config.statusList;
    this.displayName =
      this.auth.currentUser.firstName + ' ' + this.auth.currentUser.lastName;
    this.resetOptionsParameters();
    this.getstoriescategorylist();
    this.usrDetails = this.auth.usrDetails;
  }

  private getDate() {
    let d = this.f.targetdate.value;
    let m: any = d.month;

    if (m < 10) {
      m = '0' + m.toString();
    }

    return `${d.year}-${m}-${d.day}`;
  }

  ngOnInit() {
    this.resetBlogOptionsParameters();
    this.getUserDetails();
    this.getStatusCount();

    this.storyForm = this._formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(25),
          Validators.maxLength(125),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      slug: ['', [Validators.required]],
      categoryid: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(500)]],
      youtubeurl: ['', [Validators.pattern(this.patterns.url)]],
      targetdate: ['', [Validators.required]],
      targetamount: ['', [Validators.required, Validators.min(100)]],
      targetcurrency: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });

    this.updateStoryEditForm = this._formBuilder.group({
      categoryid: this.categoryid,
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(25),
          Validators.maxLength(125),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      status: ['', Validators.required],
      slug: ['', Validators.required],
      targetcurrency: ['', Validators.required],
      targetamount: ['', Validators.required],
      targetdate: ['', Validators.required],
      story: ['', [Validators.required, Validators.minLength(500)]],
      successstory: [''],
      youtubeurl: [''],
    });

    this.updateStoryMetaEditForm = this._formBuilder.group({
      metatitle: ['', [Validators.required]],
      metakeywords: ['', Validators.required],
      metadescription: ['', Validators.required],
    });
    this.mindate = new Date().toISOString().split('T')[0];

    this.blogForm = this._formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(50),
          Validators.maxLength(125),
        ],
      ],
      categoryid: ['', [Validators.required]],
      status: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(500)]],
      metatitle: ['', []],
      metadescription: ['', []],
      metakeywords: ['', []],
      file: [''],
    });
  }

  ngAfterViewInit() {
    // if (isPlatformBrowser(this.platformId)) {
    //   $('#phone1').intlTelInput({
    //     preferredCountries: ['in'],
    //      separateDialCode: true,
    //   });
    // }
  }

  changeTab(t: any) {
    this.selectedTab = t;
    if (this.selectedTab == 'campaignlist') {
      this.getStoriesList();
    }
    
    if (this.selectedTab == 'bloglist') {
      this.getBlogStatusCount();
      this.getBlogCategories();
      this.getBlogList();
    }
  }

  getStatusCount() {
    this.auth.getStoriesStatusCount().then(
      async (st: any) => {
        this.statuscounts = st;
        let list2 = [];
        this.statusList.forEach((s) => {
          s.count = this.statuscounts[s.value];
          list2.push(s);
        });
        this.statusList = list2.sort(function (a, b) {
          if (Number(a.count) < Number(b.count)) return 1;
          if (Number(a.count) > Number(b.count)) return -1;
          return 0;
        });
        if (this.isFirstTimeLoadingStoriesList) {
          this.isFirstTimeLoadingStoriesList = false;
          let maxCountStories = this.statusList[0];
          if (maxCountStories) {
            this.selected = maxCountStories.value;
          }
        }
      },
      (err) => {
        this.toastr.error(err.title, err.detail);
      }
    );
  }

  get f1() {
    return this.updateStoryEditForm.controls;
  }

  get f() {
    return this.storyForm.controls;
  }

  get b() {
    return this.blogForm.controls;
  }

  next() {
    let c = this.storyForm.controls;
    if (c.title.valid) {
      this.errStep1 = false; // no errors should display
      // If add-form, then submit story with title
      if (this.action == 'Add') {
        // this.config.showLoading();
        this.newStory();
      } else {
        // do nothing, story object will retain values for final update
        this.step = 2;
      }
    } else {
      this.errStep1 = true; // display step 1 errors
    }
  }

  newStory() {
    let c = this.storyForm.controls;
    let targetdate = new Date();
    targetdate.setMonth(targetdate.getMonth() + 1);
    let st = {
      organizationid: this.auth.currentUser.orgId
        ? this.auth.currentUser.orgId
        : '00000000-0000-0000-0000-000000000000',
      categoryid: c.categoryid.value,
      title: c.title.value,
      name: c.name.value,
      story: '',
      featuredimage: '',
      youtubeurl: '',
      slug: c.slug.value,
      report: [],
      targetdate: targetdate,
      targetamount: 100000,
      targetcurrency: 'INR',
      status: 'draft',
    };
    this.disableSubmitBtn = true;
    this.auth.addStory(st).then(
      (res: any) => {
        this.disableSubmitBtn = false;
        this.step = 2;
        this.temp = res.story;
        this.story_id = res.story.stid;
        this.storyedit = res.story;
        this.getStatusCount();
        this.getStoriesList();
        this.toastr.success(res.message);
      },
      (err: any) => {
        this.disableSubmitBtn = false;
        //  this.config.dismissLoading();
        this.toastr.error(err.title, err.detail);
      }
    );
  }

  previous() {
    if (this.step > 1) {
      this.step--;
    }
  }

  showAddModal(content: any) {
    let targetdate = new Date();
    targetdate.setMonth(targetdate.getMonth() + 1);
    this.step = 1;
    this.action = 'Add';
    this.showModalAddStoryBox = 'show';
    this.storyForm.reset();
    this.storyForm.controls.categoryid.setValue(
      this.storycategory[0].categoryid
    );
    this.storyForm.controls.status.setValue('draft');
    this.storyForm.controls.targetamount.setValue(100000);
    this.storyForm.controls.targetcurrency.setValue('INR');
    this.storyForm.controls.targetdate.setValue(targetdate);
    this.storyForm.controls.name.setValue(this.displayName);
    this.temp = null;
    /*let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      scrollable: false,
    };
    this.modalSrv.open(content, ngbModalOptions);*/
  }

  submitModal(ref: any) {
    let c = this.storyForm.controls;

    if (this.storyForm.valid) {
      this.errStep2 = false; // no errors should display

      this.temp.title = c.title.value;
      this.temp.story = c.description.value;
      this.temp.categoryid = c.categoryid.value;
      this.temp.slug = c.slug.value;
      this.temp.name = c.name.value;
      this.temp.youtubeurl = c.youtubeurl.value;
      this.temp.targetdate = this.getDate();
      this.temp.targetamount = c.targetamount.value;
      this.temp.targetcurrency = c.targetcurrency.value;
      this.temp.status = c.status.value;
      //ADD REPORT WHEN AVAILABLE
      if (
        this.storyedit &&
        this.storyedit.report &&
        this.storyedit.report.length > 0
      ) {
        this.temp.report = this.storyedit.report;
      }
      this.currentStatus = c.status.value ? c.status.value : this.currentStatus;
      this.disableSubmitBtn = true;
      // Call story update method here
      this.auth.updateStory(this.temp).then(
        (res: any) => {
          this.disableSubmitBtn = false;
          if (this.action == 'Add') {
            //this.toastr.success(res.message);
            //this.stories.options.total = this.stories.list.unshift(this.temp);
          }
          this.showModalAddStoryBox = 'hide';
          this.toastr.success(res.message);
          this.getStatusCount();
          this.getStoriesList();
          //ref.close();
        },
        (err: any) => {
          this.disableSubmitBtn = false;
          //    this.config.dismissLoading();
          this.toastr.error(err.title, err.detail);
        }
      );
    } else {
      this.errStep2 = true; // display step 2 errors
    }
  }

  updateSlug() {
    if (this.action == 'Add') {
      let s = `${this.f.name.value}`;
      s = s.toLowerCase().replace(/ +/g, '-');
      s = 'pgc-' + s;
      this.f.slug.setValue(s);
    } else {
      let s = `${this.f.name.value}`;
      s = s.toLowerCase().replace(/ +/g, '-');
      s = 'pgc-' + s;
      this.f.slug.setValue(s);
    }
  }

  handleInputChange(f: any) {
    this.config.showLoading();
    if (f.base64url && f.base64url.length > 0) {
      let sub = 'data:' + f.type + ';base64,';
      let url = f.base64url.replace(sub, '');
      let mediafor = 'featured';
      this.auth.uploadMediaStories(this.temp.stid, f.name, url, mediafor).then(
        (res: any) => {
          if (res && res.url && res.url.length > 0) {
            this.temp.featuredimage = res.url;
          }

          this.config.dismissLoading();
        },
        (err: any) => {
          this.config.dismissLoading();
          this.toastr.error(err.title, err.detail);
        }
      );
    }
  }

  handleInputChangeReport(f: any) {
    this.config.showLoading();
    if (f.base64url && f.base64url.length > 0) {
      let sub = 'data:' + f.type + ';base64,';
      let url = f.base64url.replace(sub, '');
      let mediafor = 'report';
      this.auth
        .uploadMediaStories(this.storyedit.stid, f.name, url, mediafor)
        .then(
          (res: any) => {
            if (res && res.url && res.url.length > 0) {
              this.reportImg.push(res.url);
              this.storyedit.report = this.reportImg;
            }
            //  this.config.dismissLoading();
          },
          (err: any) => {
            // this.config.dismissLoading();
            this.toastr.error(err.title, err.detail);
          }
        );
    }
  }

  onOptionsSelected() {
    this.resetOptionsParameters();
    this.story = [];
    this.showSpinner = true;
    this.getStoriesList();
  }

  onOptionsSelectedCat() {
    this.resetOptionsParameters();
    let op = this.options;
    this.showSpinner = true;
    this.auth.getStoriesByCatId(op.limit, op.pageno, this.selectedCat).then(
      (st: any) => {
        this.story = st;
        this.showSpinner = false;
      },
      (err) => {
        this.showSpinner = false;
        this.toastr.error(err.title, err.detail);
      }
    );
  }

  getUserDetails() {
    let header = {
      Authorization: 'Bearer ' + this.auth.currentUser.authToken,
    };
    this.showSpinner = true;
    this.apiService.getuserDetails(this.usrId, header).then(
      (d: any) => {
        this.usrDetails = d.user;
        if (
          this.usrDetails.rolename &&
          (this.usrDetails.rolename == 'superadmin' ||
            this.usrDetails.rolename == 'admin' ||
            this.usrDetails.rolename == 'campaignmanager')
        ) {
          this.isAdminRoles = true;
        }
        this.auth.usrDetails = this.usrDetails;

        if (this.usrDetails.rolename == 'campaignmanager') {
          this.statusList = this.statusList.filter(
            (a) => a.value.toLowerCase() != 'deleted'
          );
        }
        this.showSpinner = false;
      },
      (err) => {
        this.showSpinner = false;
        // console.log('error encountered', err);
      }
    );
  }

  searchevent(categoryname: any, catid: any) {
    this.resetOptionsParameters();
    this.options.categoryname = categoryname;
    this.categoryid = catid;
    this.catename = categoryname;
  }

  getstoriescategorylist() {
    this.apiService.getStorycategorylist().then(
      (categories: any) => {
        this.storycategory = categories;
      },
      (err) => {
        // console.log('error encountered', err);
      }
    );
  }

  //RESET OPTIONS PARAMETERS
  resetOptionsParameters() {
    this.options.pageno = 1;
    this.options.limit = 8;
    this.options.total = 0;
    this.options.offset = 0;
    this.options.search = '';
  }

  //WHEN SEARCH CLEAR
  resetGetStoryList(reset: boolean = false) {
    if (reset) {
      this.resetOptionsParameters();
      this.filterBy = '';
      this.story = [];
      this.getStoriesList();
    } else {
      if (this.filterBy && this.filterBy.length == 0) {
        this.resetOptionsParameters();
        this.story = [];
        this.options.search = '';
        this.getStoriesList();
      }
    }
  }

  searchStoryList() {
    this.resetOptionsParameters();
    this.story = [];
    this.options.search = this.filterBy;
    this.getStoriesList();
  }

  getStoriesList(reset = false) {
    this.showSpinner = true;
    let header = {
      Authorization: 'Bearer ' + this.auth.currentUser.authToken,
    };
    if (this.options.search == null) {
      this.options.search = '';
    }
    this.auth
      .storylistbyuser(
        this.options.limit,
        this.options.pageno,
        this.options.userid,
        this.options.categoryname,
        this.options.search,
        this.selected,
        header
      )
      .then(
        (story: any) => {
          if (reset == false) {
            this.data = story.list ? story.list : [];
            if (this.data && this.data.length > 0) {
              if (this.selected == story.options.status) {
                this.story = [...this.story, ...this.data];
              } else {
                this.story = this.data;
              }
            }
          }
          if (this.story.length > 0) {
            this.story = this.story.filter(
              (v, i, a) =>
                a.findIndex(
                  (v2) => v2.stid === v.stid && v2.status == this.selected
                ) === i
            );
          }

          this.options = story.options;
          this.showSpinner = false;
        },
        (err) => {
          this.showSpinner = false;
          //console.log('error encountered', err);
        }
      );
  }

  onScrollDown() {
    if (this.options.total > this.options.pageno * this.options.limit) {
      this.options.pageno++;
      this.getStoriesList();
    }
  }

  onScrollUp() {
    if (this.options.total > this.options.pageno * this.options.limit) {
      this.options.pageno++;
      this.getStoriesList();
    }
  }

  storyupdate(evt: any) {
    this.showModalUpdateStoryBox = 'show';
    this.storyedit = evt;
    this.reportImg = [];
    this.category_id = this.storyedit.categoryid;
    this.story_id = this.storyedit.stid;
    this.organisation_id = this.storyedit.organizationid;
    this.author_id = this.storyedit.authorid;
    this.featured_img = this.storyedit.featuredimage;
  }

  storyMetaUpdate(evt: any) {
    this.storyedit = evt;
    this.reportImg = [];
    this.category_id = this.storyedit.categoryid;
    this.story_id = this.storyedit.stid;
    this.organisation_id = this.storyedit.organizationid;
    this.author_id = this.storyedit.authorid;
    this.featured_img = this.storyedit.featuredimage;
  }

  hideModalUpdateStoryBox() {
    this.showModalUpdateStoryBox = 'hide';
  }

  hideModalAddStoryBox() {
    this.showModalAddStoryBox = 'hide';
  }

  openModal(template: TemplateRef<any>, id: any, type: any) {
    this.deletionType = type;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.idToBeDeleted = id;
  }

  optRadioEnable(s: any) {
    this.optradioenable = s;
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
    this.auth
      .deleteStory(this.idToBeDeleted, this.deletionType, this.optradioenable)
      .then(
        (data: any) => {
          this.toastr.success(data.message);
          this.getStatusCount();
          this.story = this.story.filter(
            (item) => item.stid != this.idToBeDeleted
          );
          this.resetOptionsParameters();
          this.getStoriesList();
        },
        (err) => {
          this.toastr.error(err.title, err.detail);
        }
      );
    this.deletestory();
  }

  deletestory(): void {
    console.log('deleted', this.idToBeDeleted, ' record');
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  onSubmitUpdateStory() {
    if (this.updateStoryEditForm.invalid) {
      return;
    } else {
      let params = this.updateStoryEditForm.value;
      params.categoryid = this.category_id;
      params.stid = this.story_id;
      params.authorid = this.author_id;
      params.organizationid = this.organisation_id;
      this.updateStoryEditForm.value.status =
        this.updateStoryEditForm.value.status.toLowerCase();

      params.featuredimage = this.featured_image || this.featured_img;
      this.disableSubmitBtn = true;
      this.updateStoryEditForm.value.report = this.storyedit.report;
      this.apiService.storysuserupdate(this.updateStoryEditForm.value).then(
        (data: any) => {
          this.showModalUpdateStoryBox = 'hide';
          console.log('changed to', this.updateStoryEditForm.value.status);
          console.log('selected', this.selected);
          if (this.selected != this.updateStoryEditForm.value.status) {
            this.getStatusCount();
            this.story = this.story.filter(
              (item) => item.stid != this.story_id
            );
          }

          this.disableSubmitBtn = false;
          this.toastr.success(data.message);
          this.closebutton.nativeElement.click();
          /*this.ngOnInit();
          this.router
            .navigateByUrl('/medical-support', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/profile']);
            });*/
        },
        (err) => {
          this.disableSubmitBtn = false;
          this.toastr.error(err.title, err.detail);
        }
      );
    }
  }

  onSubmitUpdateStoryMetaData() {
    if (this.updateStoryMetaEditForm.invalid) {
      return;
    } else {
      let params = this.updateStoryMetaEditForm.value;
      this.disableSubmitBtn = true;
      this.storyedit.metatitle = params.metatitle
        ? params.metatitle
        : this.storyedit.metatitle;
      this.storyedit.metadescription = params.metadescription
        ? params.metadescription
        : this.storyedit.metadescription;
      this.storyedit.metakeywords = params.metakeywords
        ? params.metakeywords
        : this.storyedit.metakeywords;
      this.apiService.storysuserupdate(this.storyedit).then(
        (data: any) => {
          this.disableSubmitBtn = false;
          this.toastr.success(data.message);
          this.closebutton.nativeElement.click();
        },
        (err) => {
          this.disableSubmitBtn = false;
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

  // add image upload code
  onSelectFile(event: any) {
    //console.log(event.target);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let filename = event.target.files[0].name;

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => {
        // called once readAsDataURL is completed
        this.base64code = event.target.result;
        let params = (reader.result as string).replace(/^.+?;base64,/, '');
        let mediafor = 'mediafor';

        this.auth
          .uploadStoriesMedia(this.story_id, filename, params, mediafor)
          .then(
            (data: any) => {
              this.featured_image = data.url;
            },
            (error) => {
              // console.log(error);
            }
          );
      };
    }
  }
  public delete() {
    this.base64code = null;
  }

  // multiple files uploader code
  onmultipleSelectFile(event: any) {
    //console.log(event.target);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let filename = event.target.files[0].name;
      // console.log(filename);

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => {
        // called once readAsDataURL is completed
        this.urls = event.target.result;
        let params = (reader.result as string).replace(/^.+?;base64,/, '');
        let mediafor = 'mediafor';

        this.auth
          .uploadStoriesMedia(this.story_id, filename, params, mediafor)
          .then(
            (data: any) => {
              // do something, if upload success
              //console.log(data.message);
              this.supportingDoc = data.url;
            },
            (error) => {
              // console.log(error);
            }
          );
      };
    }
  }

  removeSelectedFile(index: any) {
    this.storyedit?.report.splice(index, 1);
  }

  getBlogStatusCount() {
    this.auth.getBlogStatusCount().then(
      (list: any) => {
        this.blogsStatus = [];
        let keys = Object.keys(list);
        keys.forEach((k) => {
          this.blogsStatus.push({
            title: k,
            level: k.charAt(0).toUpperCase() + k.slice(1),
            value: list[k],
          });
        });
      },
      (err: any) => {
        this.toastr.error(err.title, err.detail);
      }
    );
  }

  getBlogList() {
    this.showSpinner = true;
    this.auth.getBlogs(this.blogs.options).then(
      (blog: any) => {
        this.blogs.options.limit = blog.options.limit;
        this.blogs.options.total = blog.options.total;
        this.blogs.options.pageno = blog.options.pageno;
        this.blogs.options.status = this.selectedBlogStatus;
        this.blogs.options.search = this.filterBlogBy;
        this.blogs.options.cslug = this.selectedBlogCategory;
        this.data = blog.list ? blog.list : [];

        if (this.data && this.data.length > 0) {
          if (this.selectedBlogStatus == blog.options.status) {
            this.blogs.list = [...this.blogs.list, ...this.data];
          } else {
            this.blogs.list = this.data;
          }
        }

        if (this.blogs.list.length > 0) {
          this.blogs.list = this.blogs.list.filter(
            (v: any, i: any, a: any) =>
              a.findIndex(
                (v2: any) =>
                  v2.bid === v.bid && v2.status == this.selectedBlogStatus
              ) === i
          );
        }
        this.showSpinner = false;
      },
      (err) => {
        this.toastr.error(err.title, err.detail);
        this.showSpinner = false;
      }
    );
  }

  getBlogCategories() {
    this.auth.getBlogCategories().then(
      (cats: any) => {
        this.blogCategories = cats;
      },
      (err: any) => {
        this.toastr.error(err.title, err.detail);
      }
    );
  }

  resetBlogOptionsParameters() {
    this.blogs = {
      options: {
        limit: 8,
        pageno: 1,
        total: 0,
        offset: 0,
        search: '',
        cslug: this.selectedBlogCategory,
        status: this.selectedBlogStatus,
      },
      list: [],
    };
  }

  onScrollDownBlogList() {
    if (
      this.blogs.options.total >
      this.blogs.options.pageno * this.blogs.options.limit
    ) {
      this.blogs.options.pageno++;
      this.getBlogList();
    }
  }

  onScrollUpBlogList() {
    if (
      this.blogs.options.total >
      this.blogs.options.pageno * this.blogs.options.limit
    ) {
      this.blogs.options.pageno++;
      this.getBlogList();
    }
  }

  onBlogOptionsSelected(s: any) {
    this.filterBlogBy = '';
    this.showSpinner = true;
    this.resetBlogOptionsParameters();
    this.getBlogList();
  }

  onBlogCategorySelected(s: any) {
    //this.filterBlogBy = '';
    this.showSpinner = true;
    this.resetBlogOptionsParameters();
    this.getBlogList();
  }

  uploadBlogFeaturedImage(i: any) {
    this.config.showLoading();
    if (i.base64url && i.base64url.length > 0) {
      let sub = 'data:' + i.type + ';base64,';
      let url = i.base64url.replace(sub, '');

      this.auth.uploadMediaBlog(this.selectedBlog.bid, i.name, url).then(
        (res: any) => {
          if (res && res.url && res.url.length > 0) {
            this.selectedBlog.featuredimage = res.url;
          }
          this.config.dismissLoading();
        },
        (err: any) => {
          this.config.dismissLoading();
          this.toastr.error(err.title, err.detail);
        }
      );
    }
  }

  blogAdditionalImages(i: any) {
    this.config.showLoading();

    if (i.base64url && i.base64url.length > 0) {
      let sub = 'data:' + i.type + ';base64,';
      let url = i.base64url.replace(sub, '');

      this.auth.uploadMediaBlog(this.selectedBlog.bid, i.name, url).then(
        (res: any) => {
          if (res && res.url && res.url.length > 0) {
            this.selectedBlog.additionalimage = res.url;
          }

          this.config.dismissLoading();
        },
        (err: any) => {
          this.config.dismissLoading();
          this.toastr.error(err.title, err.detail);
        }
      );
    }
  }

  public searchBlogs() {
    this.resetBlogOptionsParameters();
    this.blogs.options.search = this.filterBlogBy
      ? this.filterBlogBy.trim()
      : '';
    this.showSpinner = true;
    this.getBlogList();
  }

  public showBlogModalBoxhtml(blog: any) {
    this.blogForm.reset();
    this.step = 1;
    if (blog) {
      this.selectedBlog = blog;
      this.blogAction = 'Edit';
      let b = this.blogForm.controls;

      b.title.setValue(blog.title);
      b.slug.setValue(blog.slug);
      b.description.setValue(blog.description);
      b.categoryid.setValue(blog.categoryid);
      b.status.setValue(blog.status);
      b.metatitle.setValue(blog.metatitle);
      b.metadescription.setValue(blog.metadescription);
      b.metakeywords.setValue(blog.metakeywords);
      this.showBlogModalBox = 'show';
    } else {
      this.blogAction = 'Add';
      this.showBlogModalBox = 'show';
    }
  }

  public onChangeBlogTitle() {
    let b = this.blogForm.controls;
    let slug = this.auth.convertToSlug(b.title.value);
    b.slug.setValue(slug);
  }

  blogNextStep() {
    let b = this.blogForm.controls;
    if (b.title.valid) {
      if (this.blogAction == 'Add') {
        this.showSpinner = true;
        this.createNewBlog();
        //Create New Blog Here
      } else {
        this.step = 2;
      }
    } else {
      this.errStep1 = true;
    }
  }

  blogPreviousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  createNewBlog() {
    let c = this.blogForm.controls;

    let b = {
      categoryid: c.categoryid.value,
      title: c.title.value,
      slug: c.slug.value,
      featuredimage: '',
      additionalimage: '',
      youtubeurl: '',
      description: '',
      status: 'draft',
    };

    this.auth.addBlog(b).then(
      (res: any) => {
        this.errStep1 = false;
        this.getBlogStatusCount();
        this.step = 2;
        this.selectedBlog = res.blog;
        this.showSpinner = false;
      },
      (err: any) => {
        this.showSpinner = false;
        this.toastr.error(err.title, err.detail);
      }
    );
  }

  submitBlogModal() {
    let c = this.blogForm.controls;

    if (this.blogForm.valid) {
      this.errStep2 = false;
      this.selectedBlog.title = c.title.value;
      this.selectedBlog.slug = c.slug.value;
      this.selectedBlog.description = c.description.value;
      this.selectedBlog.categoryid = c.categoryid.value;
      this.selectedBlog.status = c.status.value;
      this.selectedBlog.metatitle = c.metatitle.value;
      this.selectedBlog.metadescription = c.metadescription.value;
      this.selectedBlog.metakeywords = c.metakeywords.value;

      let bl = {
        bid: this.selectedBlog.bid,
        categoryid: this.selectedBlog.categoryid,
        title: this.selectedBlog.title,
        slug: this.selectedBlog.slug,
        featuredimage: this.selectedBlog.featuredimage || '',
        additionalimage: this.selectedBlog.additionalimage || '',
        youtubeurl: this.selectedBlog.youtubeurl || '',
        description: this.selectedBlog.description || '',
        metatitle: this.selectedBlog.metatitle || '',
        metakeywords: this.selectedBlog.metakeywords || '',
        metadescription: this.selectedBlog.metadescription || '',
        status: this.selectedBlog.status || '',
      };

      this.showSpinner = true;
      this.auth.updateBlog(bl).then(
        (res: any) => {
          this.showSpinner = false;
          this.getBlogStatusCount();
          this.toastr.info('Updated Successfully', '');
        },
        (err: any) => {
          this.showSpinner = false;
          this.toastr.error(err.title, err.detail);
        }
      );
    } else {
      this.errStep2 = true; // display step 2 errors
    }
  }

  public hideBlogModalBoxhtml() {
    this.showBlogModalBox = 'hide';
  }

  removeHTML(str: any, len: any) {
    len = len ? len : 50;
    let t = '';
    if (str && str.length > 0) {
      t = str.replace(/(<([^>]+)>)/gi, '');
      if (t.length > len) {
        t = t.substring(0, len).toLowerCase() + '...';
      }
    }
    return t;
  }
}
