import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignanonymoususerComponent } from './campaignanonymoususer.component';

describe('CampaignanonymoususerComponent', () => {
  let component: CampaignanonymoususerComponent;
  let fixture: ComponentFixture<CampaignanonymoususerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignanonymoususerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignanonymoususerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
