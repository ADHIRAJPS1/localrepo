import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.css']
})
export class MapModalComponent implements OnInit {

  constructor(public config: Config) { }

  ngOnInit(): void {
  }

}
