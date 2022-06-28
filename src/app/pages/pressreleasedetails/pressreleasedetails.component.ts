import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'app-pressreleasedetails',
  templateUrl: './pressreleasedetails.component.html',
  styleUrls: ['./pressreleasedetails.component.css']
})
export class PressreleasedetailsComponent implements OnInit {

  constructor(public config: Config) { }

  ngOnInit(): void {
    this.config.dismissLoading();
  }

}
