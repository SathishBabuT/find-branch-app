import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindBranchListViewComponent } from './find-branch-list-view.component';

describe('FindBranchListViewComponent', () => {
  let component: FindBranchListViewComponent;
  let fixture: ComponentFixture<FindBranchListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindBranchListViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindBranchListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
