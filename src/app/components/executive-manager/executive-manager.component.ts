import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, } from '@angular/forms';
@Component({
  selector: 'executive-manager',
  templateUrl: './executive-manager.component.html',
  styleUrls: ['./executive-manager.component.css']
})
export class ExecutiveManagerComponent implements OnInit {
  executiveManagerForm : FormGroup;
  submitted = false;
  constructor(private formBuilder:FormBuilder) { }

  // convenience getter for easy access to form fields
  get f() { return this.executiveManagerForm.controls; }

  ngOnInit(): void {
    this.executiveManagerForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
    })
  }
  onSubmitEManager(){

  }
}
