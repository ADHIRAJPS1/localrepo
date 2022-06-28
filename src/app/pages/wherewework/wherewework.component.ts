import { AfterViewInit, Component } from '@angular/core';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'app-wherewework',
  templateUrl: './wherewework.component.html',
  styleUrls: ['./wherewework.component.css']
})
export class WhereweworkComponent implements AfterViewInit {

  constructor(public config: Config) { }

  ngAfterViewInit(): void {
    this.config.dismissLoading();
  }

}
