import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Config } from 'src/app/services/config';
import AOS from 'aos';
import { Meta, Title  } from '@angular/platform-browser';
import seo from '../../services/medical-awareness.json';
@Component({
  selector: 'app-medicaltopicsdetails',
  templateUrl: './medicaltopicsdetails.component.html',
  styleUrls: ['./medicaltopicsdetails.component.css'],
})
export class MedicaltopicsdetailsComponent {
  @ViewChild('MedicalData') MedicalData: any;
  nSlug: any;
  healthdetails: any;
  description:any;
  medicalData:any = {};
  messageStringlimit:number = 100;
  medicalDetails:any
  constructor(
    public apiservice: ApiService,
    private route: ActivatedRoute,
    public router: Router,
    public toastr: ToastrService,
    public config: Config,
    private title: Title,
    private meta : Meta,
  ) {
    this.nSlug = this.route.snapshot.paramMap.get('nSlug');
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
       // this.htid = this.route.snapshot.paramMap.get('name');
        this.healthdetails = JSON.parse(localStorage.getItem('dataSource'));
        // this.healthdetails = this.healthdetails.filter(
        //   (h) => this.htid == h.name
        // )[0];
      }
    });
  }
  getDescriptionsData() {
    let des = this.description;
     return des;
   }
  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    if (this.nSlug) {
     // this.currentdata = this.route.snapshot.data.story;
      this.medicalData = this.route.snapshot.data.medical.data;
      this.title.setTitle(this.medicalData.name);

     // this.currentPageUrl = this.document.location.href;
    } else {
      this.config.dismissLoading();
    }
    AOS.init();
  }

}
