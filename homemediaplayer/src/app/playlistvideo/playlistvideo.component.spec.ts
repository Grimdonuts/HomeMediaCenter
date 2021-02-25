import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistvideoComponent } from './playlistvideo.component';

describe('PlaylistvideoComponent', () => {
  let component: PlaylistvideoComponent;
  let fixture: ComponentFixture<PlaylistvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistvideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
