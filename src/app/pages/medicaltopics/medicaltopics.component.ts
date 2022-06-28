import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Config } from 'src/app/services/config';
import AOS from 'aos';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-medicaltopics',
  templateUrl: './medicaltopics.component.html',
  styleUrls: ['./medicaltopics.component.css'],
})
export class MedicaltopicsComponent implements OnInit {
  data: any;
  medicaltopic_cat: any;
  messageStringlimit:number = 100
  constructor(
    public apiService: ApiService,
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public config: Config,
    private router:Router,
    @Inject(DOCUMENT) private dom
  ) { }

  ngOnInit(): void {
    AOS.init({
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,
    });
    this.getList();
  }

  getList() {
    this.config.showLoading();
    this.apiService.gethealthListService().then(
      (res: any) => {
        this.data = res.list;
        let topics = this.data.map((t) => t.category);
        this.medicaltopic_cat = [...new Set(topics)];
        this.config.dismissLoading();
      },
      (err) => {
        this.config.dismissLoading();
        console.log('error encountered: ', err);
      }
    );
  }
  gotoMedicalDetails(data){
   localStorage.setItem('dataSource', JSON.stringify(data));
   localStorage.setItem('description', JSON.stringify(data.description.replace(/(<([^>]+)>)/gi, "").slice(0, 100)));
    ///medical-awareness/{{val?.name}}
    this.router.navigate(['/medical-awareness/' +data.name]);
   // console.log(data)
  }
  scrollPointA(id) {
    this.dom.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }

}
