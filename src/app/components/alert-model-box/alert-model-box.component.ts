import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-model-box',
  templateUrl: './alert-model-box.component.html',
  styleUrls: ['./alert-model-box.component.css']
})
export class AlertModelBoxComponent implements OnInit {
  @Input() message
  constructor(private modalService: NgbModal,
    public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }

}
