import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';

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

@Input() storeAddress: any[];
@Input() listView: boolean;
@Output() filterResultEvent = new EventEmitter<any>();
@Output() panToLocation = new EventEmitter<any>();
@ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
@ViewChildren("storeDetails") storeDetails: QueryList<ElementRef>;
//@ViewChildren("checkboxesTow") checkboxesTwo: QueryList<ElementRef>; 

  constructor(private httpClient: HttpClient) {
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['storeAddress']) {
      console.log(changes['storeAddress']);
    }
  }

  onSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.address.toLocaleLowerCase().indexOf(term) > -1;
  }

  addressChange(selectedObj:any) {
    //this.branchList = this.storeAddress.filter(data => data.street === selectedObj.street);
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

}
