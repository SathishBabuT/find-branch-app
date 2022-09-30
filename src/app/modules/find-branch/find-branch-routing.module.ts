import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindBranchDetailsComponent } from './find-branch-details/find-branch-details.component';
import { FindBranchMapViewComponent } from './find-branch-map-view/find-branch-map-view.component';

const routes: Routes = [
  {path: '', component: FindBranchMapViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FindBranchRoutingModule { }
