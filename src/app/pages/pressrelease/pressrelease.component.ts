import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'app-pressrelease',
  templateUrl: './pressrelease.component.html',
  styleUrls: ['./pressrelease.component.css']
})
export class PressreleaseComponent implements OnInit {

  constructor(public config: Config) { }

  ngOnInit(): void {
    this.config.dismissLoading();
  }

}
