import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessstoriesdetailsComponent } from './successstoriesdetails.component';

describe('SuccessstoriesdetailsComponent', () => {
  let component: SuccessstoriesdetailsComponent;
  let fixture: ComponentFixture<SuccessstoriesdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessstoriesdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessstoriesdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
