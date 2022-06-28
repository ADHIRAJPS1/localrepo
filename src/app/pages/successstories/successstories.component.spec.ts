import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessstoriesComponent } from './successstories.component';

describe('SuccessstoriesComponent', () => {
  let component: SuccessstoriesComponent;
  let fixture: ComponentFixture<SuccessstoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessstoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessstoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
