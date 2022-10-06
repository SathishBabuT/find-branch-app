import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  jsonPath = "../../assets/mocks/api/stores.json";
  constructor(private http: HttpClient) { }

  getStoreDetails(): Observable<any> {
    return this.http.get<any>(this.jsonPath);
  }
  
  getAddressAlone(): Observable<any> {
    return this.http.get<any>(this.jsonPath).pipe(map(res=> {
      return res.stores;
    }));
  }
}
