import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/services/config';
import AOS from 'aos';
@Component({
  selector: 'app-partnerwithus',
  templateUrl: './partnerwithus.component.html',
  styleUrls: ['./partnerwithus.component.css']
})
export class PartnerwithusComponent implements OnInit {

  constructor(public config: Config) { }

  ngOnInit(): void {
    AOS.init({
      duration: 600,
    });
    this.config.dismissLoading();
  }
}
