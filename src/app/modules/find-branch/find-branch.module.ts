import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { FindBranchRoutingModule } from './find-branch-routing.module';
import { FindBranchDetailsComponent } from './find-branch-details/find-branch-details.component';
import { FindBranchListViewComponent } from './find-branch-list-view/find-branch-list-view.component';
import { FindBranchMapViewComponent } from './find-branch-map-view/find-branch-map-view.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';


@NgModule({
  declarations: [
    FindBranchDetailsComponent,
    FindBranchListViewComponent,
    FindBranchMapViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FindBranchRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FindBranchModule { }
