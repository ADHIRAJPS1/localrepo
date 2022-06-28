import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicaltopicsdetailsComponent } from './medicaltopicsdetails.component';

describe('MedicaltopicsdetailsComponent', () => {
  let component: MedicaltopicsdetailsComponent;
  let fixture: ComponentFixture<MedicaltopicsdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicaltopicsdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicaltopicsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
