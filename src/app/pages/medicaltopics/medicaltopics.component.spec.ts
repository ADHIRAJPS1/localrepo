import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicaltopicsComponent } from './medicaltopics.component';

describe('MedicaltopicsComponent', () => {
  let component: MedicaltopicsComponent;
  let fixture: ComponentFixture<MedicaltopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicaltopicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicaltopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
