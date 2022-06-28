import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressreleasedetailsComponent } from './pressreleasedetails.component';

describe('PressreleasedetailsComponent', () => {
  let component: PressreleasedetailsComponent;
  let fixture: ComponentFixture<PressreleasedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PressreleasedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PressreleasedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
