import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { catchError, concat, debounceTime, distinctUntilChanged, filter, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-find-branch-list-view',
  templateUrl: './find-branch-list-view.component.html',
  styleUrls: ['./find-branch-list-view.component.scss']
})
export class FindBranchListViewComponent implements OnInit {
branchDetails: any[];
selectedBranch: any;
branchList: any[];
isOpenFilter: boolean = false;
serviceListOne: any[];
serviceListTwo: any[];
selectedService: any[] = [];
selectedStoreDetails: any[];
navigateToDetailPage: boolean = false;
valueSelected: boolean = true;
minTermLength: number = 3;
isLoading: boolean = false;
addressInput$ = new Subject<string>();
address: Observable<any>;

@Input() storeAddress: any[];
@Input() listView: boolean;
@Output() filterResultEvent = new EventEmitter<any>();
@Output() panToLocation = new EventEmitter<any>();
@Output() closeInfoWindow = new EventEmitter<any>();
@Output() drawMarkers = new EventEmitter<any>();
@ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
@ViewChildren("storeDetails") storeDetails: QueryList<ElementRef>;
//@ViewChildren("checkboxesTow") checkboxesTwo: QueryList<ElementRef>; 

  constructor(private httpClient: HttpClient, private apiCall: ApiCallService) {
  }

  ngOnInit(): void {
    // this.branchDetails = [{
    //   "id": "96567eaf-7df4-4a7e-8327-74c48b5411f2",
    //   "state": "Wien",
    //   "address": "Stadiongasse 10, 1010 Wien",
    //   "branchName": "BAWAG Filiale",
    //   "zip": "1010",
    //   "phone": "059905609100",
    //   "email": "GS091@bawag.at"
    // }, {
    //   "id": "a77a2cae-7ebb-4d6f-a16c-956b42dc7e25",
    //   "state": "Wien",
    //   "address": "Wipplinger Strabe 1, 1010 Wien",
    //   "branchName": "BAWAG Filiale",
    //   "zip": "1010",
    //   "phone": "059905609100",
    //   "email": "GS100@bawag.at"
    // }];
    this.serviceListOne = [{
      "id": "84494",
      "label": "Bargeldservice",
      "isSelected": false
    }, {
      "id": "84500",
      "label": "Kontostandsinfo",
      "isSelected": false
    }, {
      "id": "84566",
      "label": "Bargeldeinzahlung",
      "isSelected": false
    }];
    this.serviceListTwo = [{
      "id": "104598",
      "label": "SB Zone 7 / 24"
    }, {
      "id": "88654",
      "label": "Barrierefrei"
    }, {
      "id": "84566",
      "label": "Businesskonto"
    }];
    this.branchList = this.storeAddress;
    this.loadStoreDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['storeAddress']) {
      console.log(changes['storeAddress']);
    }
  }

  // onSearch(term: string, item: any) {
  //   term = term.toLocaleLowerCase();
  //   return item.address.toLocaleLowerCase().indexOf(term) > -1;
  // }

  addressChange(selectedObj:any) {
    console.log(selectedObj);
    if(selectedObj) {
      this.drawMarkers.emit();
    }
    // if(selectedObj) {
    //   this.valueSelected = true;
    //   this.branchList = this.storeAddress;
    //   this.addMarkers.emit();
    // }
    //this.branchList = this.storeAddress.filter(data => data.street === selectedObj.street);
  }

  loadStoreDetails() {
    this.address = concat(
      of([]),
      this.addressInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minTermLength 
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(()=> this .isLoading = true),
        switchMap(term => { 
          return this.apiCall.getAddressAlone().pipe(map(res=> {
          return this.reprocess(res)}),
          catchError(() => of([])),
          tap(() => this.isLoading = false)
          )
        })

      )
    )
  }

  reprocess(res: any) {
    let address:any[] = [];
    res.forEach((r:any) => {
      r.info.address['fullName'] = r.info.address.street + ',' +r.info.address.plz + r.info.address.city;
      address.push(r.info.address);
    })
    return address;
  }

  invokeFilter() {
    this.isOpenFilter = !this.isOpenFilter;
  }

  clearFilters() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    this.selectedService.length = 0;
    // this.checkboxesTwo.forEach((element) => {
    //   element.nativeElement.checked = false;
    // });
  }

  takeToSpecificStore(storeDetails: any, sIndex: number) {
    this.selectedStoreDetails = [];
    storeDetails['index'] = sIndex;
    this.panToLocation.emit(storeDetails);
    this.selectedStoreDetails.push(storeDetails);
    this.navigateToDetailPage = true;
  }

  highlightSpecificStore(storeDetails: any, index: number) {
    this.selectedStoreDetails = [];
    storeDetails['index'] = index;
    this.panToLocation.emit(storeDetails);
  }

  removeHighlight(storeDetails: any, index: number) {
    this.selectedStoreDetails.length = 0;
    this.closeInfoWindow.emit();
  }

  selectService(serviceId: string, eve: any) {
    if(eve.currentTarget.checked) {
      this.selectedService.push(serviceId);
    } else {
      const sIndex = this.selectedService.findIndex(id => id === serviceId);
      this.selectedService.splice(sIndex, 1);
    }
    console.log(serviceId + ',' +eve.currentTarget.checked);
  }

  applyFilter() {
    this.filterResultEvent.emit(this.selectedService);
    this.isOpenFilter = !this.isOpenFilter;
  }

  navigateBack() {
    this.selectedStoreDetails.length = 0;
    this.navigateToDetailPage = false;
  }

  trackByFn(item: any) {
    return item.id;
  }

}
