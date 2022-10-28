import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindBranchDetailsComponent } from './find-branch-details.component';

describe('FindBranchDetailsComponent', () => {
  let component: FindBranchDetailsComponent;
  let fixture: ComponentFixture<FindBranchDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindBranchDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindBranchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
