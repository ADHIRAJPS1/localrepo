import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpusComponent } from './helpus.component';

describe('HelpusComponent', () => {
  let component: HelpusComponent;
  let fixture: ComponentFixture<HelpusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
