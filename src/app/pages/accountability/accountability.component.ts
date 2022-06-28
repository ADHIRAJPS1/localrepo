import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/services/config';
import AOS from 'aos';
@Component({
  selector: 'app-accountability',
  templateUrl: './accountability.component.html',
  styleUrls: ['./accountability.component.css']
})
export class AccountabilityComponent implements OnInit {

  constructor(public config: Config) { }

  ngOnInit(): void {
    AOS.init();
    this.config.dismissLoading();
  }

}
