import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurgalleryComponent } from './ourgallery.component';

describe('OurgalleryComponent', () => {
  let component: OurgalleryComponent;
  let fixture: ComponentFixture<OurgalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurgalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OurgalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
