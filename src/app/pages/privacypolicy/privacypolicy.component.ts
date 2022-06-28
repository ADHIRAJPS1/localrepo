import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.css']
})
export class PrivacypolicyComponent implements OnInit {

  constructor(public config: Config) { }

  ngOnInit(): void {
    this.config.dismissLoading();
  }

}
