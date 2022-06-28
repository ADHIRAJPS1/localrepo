import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauseDetailsComponent } from './cause-details.component';

describe('CauseDetailsComponent', () => {
  let component: CauseDetailsComponent;
  let fixture: ComponentFixture<CauseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CauseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
