import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppAuth } from 'src/app/services/app-auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableService } from 'src/app/services/table.service';
import { Observable } from 'rxjs';
import { SortableHeaderDirective } from 'src/app/directives/sortable.directive';
import { Config } from 'src/app/services/config';
import { MustMatch } from 'src/app/shared/app-validators';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  @ViewChildren(SortableHeaderDirective)
  headers: QueryList<SortableHeaderDirective>;

  emps: Array<any> = [];
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  temp: any = {};
  roles: Array<any> = [];
  userForm: FormGroup;
  showErr: boolean = false;
  action: string = 'Add';
  pattern: RegExp =
    /^( )*([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})( )*$/;

  page = 1;
  pageSize = 10;
  show = true;
  resultList$: Observable<any[]>;
  total$: Observable<number>;
  public pageIndex = 1;
  showSpinner: boolean = false;

  displayedColumns = [
    { displayname: 'S.No.', columnname: '' },
    { displayname: 'Name', columnname: 'fullname' },
    { displayname: 'Contact', columnname: 'phonenumber' },
    { displayname: 'Designation', columnname: 'rolename' },
    { displayname: 'Last Login', columnname: 'lastlogintime' },
    { displayname: 'Status', columnname: 'lockoutenabled' },
    { displayname: 'Actions', columnname: '' },
  ];

  constructor(
    public auth: AppAuth,
    public toastr: ToastrService,
    private modalService: NgbModal,
    fb: FormBuilder,
    public tableService: TableService,
    public config: Config
  ) {
    this.tableService.searchTerm = '';
    this.resultList$ = tableService.resultList$;
    this.total$ = tableService.total$;

    this.userForm = fb.group(
      {
        firstname: ['', Validators.required],
        middlename: [''],
        lastname: ['', Validators.required],
        role: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(this.pattern),
          ],
        ],
        phonenumber: ['', [Validators.required]],
        status: [true],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [
          MustMatch('password', 'confirmPassword'),
          MustMatch('confirmPassword', 'password'),
        ],
      }
    );
  }

  ngOnInit(): void {
    this.showSpinner = true;
    this.refreshEmpList();

    this.auth.getAllRoles().then(
      (roles: any) => {
        this.roles = roles;
      },
      (err: any) => {
        // this.toastr.error(err.title, err.detail);
      }
    );

    this.total$.subscribe((l) => {
      if (l < this.pageSize) {
        this.show = false;
      } else {
        this.show = true;
      }
    });
  }
  get totalCount() {
    let count = 0;
    if (this.tableService.total$) {
      this.tableService.total$.subscribe((res) => {
        count = res;
      });
    }
    return count;
  }

  refreshEmpList() {
    this.config.showLoading();
    this.auth.getEmpList().then(
      (res: any) => {
        this.emps = res;
        this.tableService.DATA = res;
        this.sorting('fullname', '');
        this.showSpinner = false;
      },
      (err: any) => {
        this.toastr.error(err.title, err.detail);
        this.showSpinner = false;
      }
    );
  }

  public onPagination(page: any) {
    this.tableService.page = page;
  }

  onSort({ column, direction }: any) {
    // this.paginator.pageIndex = 0;
    this.sorting(column, direction);
  }

  sorting(column: any, direction: any) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      } else {
        header.direction = direction;
      }
    });

    this.tableService.sortColumn = column;
    this.tableService.sortDirection = direction;
    this.tableService.page = 1;
    this.tableService.searchOn = ['fullname', 'phonenumber', 'rolename'];
  }

  setPageSize() {
    this.tableService.pageSize = this.pageSize;
  }

  reload() {
    this.tableService.searchTerm = '';
    this.refreshEmpList();
  }

  submitModal(ref: any) {
    if (this.action == 'Add') {
      this.addEmp(ref);
    } else {
      this.updateEmp(ref);
    }
  }

  private setFormValues(emp: any) {
    let u = this.userForm.controls;

    u.firstname.setValue(emp.firstname);
    u.middlename.setValue(emp.middlename);
    u.lastname.setValue(emp.lastname);
    u.role.setValue(emp.rolename);
    u.phonenumber.setValue(emp.phonenumber);
    u.email.setValue(emp.email);

    if (emp.lockoutenabled == true) {
      u.status.setValue(false);
    } else {
      u.status.setValue(true);
    }
  }

  showEdit(content: any, emp: any) {
    this.action = 'Edit';
    this.userForm.reset();
    this.temp = emp;
    this.setFormValues(emp);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  isValidUser() {
    let controls = Object.keys(this.userForm.controls);
    let validity = true;

    controls.forEach((c) => {
      if (c.toLowerCase().includes('password')) {
        // do nothing, ignore
      } else if (this.userForm.controls[c].invalid) {
        validity = false;
      }
    });

    return validity;
  }

  private updateEmp(ref: any) {
    if (this.isValidUser()) {
      this.showSpinner = true;
      this.showErr = false;
      let v = this.userForm.value;
      v['userid'] = this.temp.userid;
      v['lockoutenabled'] = !v.status;
      v['phonenumber'] = v.phonenumber.e164Number;

      this.auth.updateUser(v).then(
        (rp: any) => {
          let e = this.emps.filter((u) => u.userid == this.temp.userid);
          this.updateEmpParams(e[0]);
          this.showSpinner = false;
          this.showErr = false;
          ref.close();
        },
        (err: any) => {
          this.showSpinner = false;
          this.toastr.error(err.title, err.detail);
        }
      );
    } else {
      this.showErr = true;
    }
  }

  private updateEmpParams(e: any) {
    let v = this.userForm.value;
    e.phonenumber = v.phonenumber;
    e.firstname = v.firstname;
    e.middlename = v.middlename;
    e.lastname = v.lastname;
    e.rolename = v.role;
    e.phonenumber = v.phonenumber;
    e.lockoutenabled = !v.status;

    let d = this.roles.filter((r) => r.name == v.role);

    if (d.length > 0) {
      e.designation = d[0].description;
    }

    this.tableService.DATA = this.emps;
    this.sorting('fullname', 'asc');

    this.showSpinner = false;
  }

  showAddModal(content: any) {
    this.action = 'Add';
    this.userForm.reset();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title-add',
    });
  }

  private addEmp(ref: any) {
    let v = this.userForm.value;
    if (this.userForm.valid) {
      this.showSpinner = true;

      let data = {
        role: v.role,
        email: v.email,
        firstname: v.firstname,
        lastname: v.lastname,
        middlename: v.middlename,
        password: v.password,
        phonenumber: v.phonenumber.e164Number,
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        postalcode: '',
        dob: '',
        gender: '',
        timezone: '',
        additionaldata: {},
      };
      this.auth.register(data).then(
        (res: any) => {
          this.showErr = false;

          this.refreshEmpList();
          this.showSpinner = false;

          ref.close();
        },
        (err: any) => {
          this.showSpinner = false;
          this.toastr.error(err.title, err.detail);
        }
      );
    } else {
      this.showErr = true;
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
}
