import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhereweworkComponent } from './wherewework.component';

describe('WhereweworkComponent', () => {
  let component: WhereweworkComponent;
  let fixture: ComponentFixture<WhereweworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhereweworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhereweworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
