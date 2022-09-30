import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindBranchMapViewComponent } from './find-branch-map-view.component';

describe('FindBranchMapViewComponent', () => {
  let component: FindBranchMapViewComponent;
  let fixture: ComponentFixture<FindBranchMapViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindBranchMapViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindBranchMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
