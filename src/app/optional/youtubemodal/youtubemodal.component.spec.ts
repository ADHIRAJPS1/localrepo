import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubemodalComponent } from './youtubemodal.component';

describe('YoutubemodalComponent', () => {
  let component: YoutubemodalComponent;
  let fixture: ComponentFixture<YoutubemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoutubemodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
