import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingeventsdetailsComponent } from './upcomingeventsdetails.component';

describe('UpcomingeventsdetailsComponent', () => {
  let component: UpcomingeventsdetailsComponent;
  let fixture: ComponentFixture<UpcomingeventsdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingeventsdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingeventsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
