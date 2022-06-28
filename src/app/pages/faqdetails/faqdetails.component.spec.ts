import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqdetailsComponent } from './faqdetails.component';

describe('FaqdetailsComponent', () => {
  let component: FaqdetailsComponent;
  let fixture: ComponentFixture<FaqdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
