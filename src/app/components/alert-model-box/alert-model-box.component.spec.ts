import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertModelBoxComponent } from './alert-model-box.component';

describe('AlertModelBoxComponent', () => {
  let component: AlertModelBoxComponent;
  let fixture: ComponentFixture<AlertModelBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertModelBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertModelBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
