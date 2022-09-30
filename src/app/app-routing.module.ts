import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

let redirectUrl = '/findBranch';
const routes: Routes = [
  { path: '', redirectTo: redirectUrl, pathMatch: 'full' },
  { path: 'findBranch', loadChildren: () => import(`./modules/find-branch/find-branch.module`).then(
    module => module.FindBranchModule
  )}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
