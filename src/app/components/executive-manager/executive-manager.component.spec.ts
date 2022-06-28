import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveManagerComponent } from './executive-manager.component';

describe('ExecutiveManagerComponent', () => {
  let component: ExecutiveManagerComponent;
  let fixture: ComponentFixture<ExecutiveManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutiveManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
