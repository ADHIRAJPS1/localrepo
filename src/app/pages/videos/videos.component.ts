import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  constructor(public config: Config) { }

  ngOnInit(): void {
    this.config.dismissLoading();
  }

}
