import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/services/config';

@Component({
  selector: 'app-termsandcondition',
  templateUrl: './termsandcondition.component.html',
  styleUrls: ['./termsandcondition.component.css']
})
export class TermsandconditionComponent implements OnInit {

  constructor(public config: Config) { }

  ngOnInit(): void {
    this.config.dismissLoading();
  }

}
