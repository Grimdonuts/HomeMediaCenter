import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateplaylistComponent } from './createplaylist.component';

describe('CreateplaylistComponent', () => {
  let component: CreateplaylistComponent;
  let fixture: ComponentFixture<CreateplaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateplaylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateplaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
