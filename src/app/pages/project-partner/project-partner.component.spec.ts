import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPartnerComponent } from './project-partner.component';

describe('ProjectPartnerComponent', () => {
  let component: ProjectPartnerComponent;
  let fixture: ComponentFixture<ProjectPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
