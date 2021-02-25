import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistorderComponent } from './playlistorder.component';

describe('PlaylistorderComponent', () => {
  let component: PlaylistorderComponent;
  let fixture: ComponentFixture<PlaylistorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
