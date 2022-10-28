import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-find-branch-map-view',
  templateUrl: './find-branch-map-view.component.html',
  styleUrls: ['./find-branch-map-view.component.scss']
})
export class FindBranchMapViewComponent implements OnInit {
  apiLoaded: Observable<boolean>;
  mapOptions: google.maps.MapOptions = {
    zoom : 14,
    zoomControl: true,
    streetViewControl: true,
    maxZoom: 16,
    minZoom: 4
  }
  center: any;
  markers: any[] = [];
  infoOptions = {};
  storeAddress: any[] = [];
  storeAddressBackup: any[] = [];
  markersBackup: any[] = [];
  listView: boolean = true;
  counter: number = 1;
  @ViewChild('googleMap', { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild('marker') mapMarkerDummy: MapMarker;
  //@ViewChild(MapInfoWindow) infoWindowViews: QueryList<MapInfoWindow>;
  constructor(private httpClient: HttpClient, private cd: ChangeDetectorRef, private apiCall: ApiCallService, private zone: NgZone) {
    this.apiLoaded = this.httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyANUA3Ri4WgvtbZwxcUahgvv-RD8Bkjlwc&libraries=geometry', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
    );
  }

  ngOnInit(): void {
    this.initCenter();
    // let loader = new Loader({
    //   apiKey: 'AIzaSyANUA3Ri4WgvtbZwxcUahgvv-RD8Bkjlwc'
    // })

    // let mapProperties = {
    //   center: new google.maps.LatLng(47.5162, 14.5501),
    //   zoom: 6
    // }

    // loader.load().then(()=> {
    //   this.maps = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    // })

    // this.apiLoaded = this.httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyANUA3Ri4WgvtbZwxcUahgvv-RD8Bkjlwc', this.mapLoaded())
    // .pipe(
    //   map(() => true),
    //   catchError(() => of(false)),
    // );

    // this.httpClient.get<any>('https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location').subscribe((res)=> {
    //    console.log(res);
    // })

    // https://filialsuche.bawag.at/BAWAGPSK/PK/filialsuche/269546/filialsuche.html?view=asQuery&onlineSales=&maxItems=10&andFilter=true&simple=true&requiredServices=&wsCall=true&lat=48.2088364&lng=16.3734791&postal_code=1010&city=Wien&street=Stephansplatz&locationFilter=address&timestamp=1664286298519&environments=&services=&languages=&storefinderType=simple
  }

  initCenter() {
    this.center = navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    });
    //return 'success';
  }

  onModelChange(event: any) {
    console.log(event);
  }

  // openInfoWindow(marker: MapMarker, windowIndex: number) {
  //   let currentIdx = 0;
  //   this.infoWindowViews.forEach((infoWindow: MapInfoWindow)=> {
  //     if(windowIndex === currentIdx) {
  //       infoWindow.open(marker);
  //       currentIdx++;
  //     } else {
  //       currentIdx++;
  //     }
  //   })
  // }

  openInfoWindow(marker: MapMarker, contentString: string, markerIndex?: number) {
    if(markerIndex!==0) {
      this.infoOptions = {
        pixelOffset: new google.maps.Size(0, 0),
        content: contentString
      };
      //marker.icon = { "url": "../assets/bawag_indicator.png", "scaledSize": {"height": 60, "width": 60} };
      this.infoWindow.open(marker);
    }
  }

  drawMarkers(event: any) {
    const currentLatLng = new google.maps.LatLng(this.center.lat, this.center.lng)
    this.apiCall.getStoreDetails().subscribe(response => {
      let location_logo = { "url": "../assets/bawag_indicator.png", "scaledSize": {"height": 50, "width": 50}};;
      this.markers.push({
        "position": { "lat": this.center.lat, "lng": this.center.lng},
        "options": {
          "animation": google.maps.Animation.DROP
        },
        "icon": {
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: '#F6F6F6',
          fillColor: '#5080F0',
          fillOpacity: 1,
          scale: 10
        }
      })
      const walk="../../../../assets/walk.png";
      response.stores.forEach((res: any, index: number)=> {
        const storeLatLng = new google.maps.LatLng(res.map.lat, res.map.lng);
        const distanceCalc = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng, storeLatLng);
        let distanceCalcInUnit;
        if((distanceCalc/1000) > 1) {
          distanceCalcInUnit = Math.round(distanceCalc/1000) + 'km';
        } else {
          distanceCalcInUnit = distanceCalc.toFixed() + 'm';
        }
        // if(index===0) {
        //   location_logo = { "url": "../assets/bawag_indicator.png", "scaledSize": {"height": 60, "width": 60}};
        // } else {
        //   location_logo = { "url": "../assets/bawag_indicator.png", "scaledSize": {"height": 30, "width": 30}};
        // }
        const markerObj = {
          "position": { "lat": res.map.lat, "lng": res.map.lng },
          "options": {
            "animation": google.maps.Animation.DROP
          },
          "icon": location_logo,
          "info": '<div id="content">' + '<h5 class="heading">'+ res.title +'</h5>' +
                    '<div id="bodyContent">' +
                    '<span><b>'
                    + res.info.address.street +'</b></span><br><span><b>'+ res.info.address.plz + ' ' + res.info.address.city + '</b></span><br><span><img src='+ walk +' class="me-2">'+ distanceCalcInUnit +'</b></span><br>'+
                    '<span>'+ res.info.status +'</b></span></div></div>'
        };
        this.markers.push(markerObj);
        const storeObj = {
          "street": res.info.address.street,
          "zip": res.info.address.plz,
          "city": res.info.address.city,
          "state": res.info.address.state,
          "address": res.info.address.street+ ', '+res.info.address.city,
          "distance": distanceCalcInUnit,
          "phone": res.info.phone,
          "email": res.info.email.split('@')[0],
          "title": res.title,
          "lat": res.map.lat,
          "lng": res.map.lng,
          "status": res.info.status,
          'services': res.info.services
        }
        this.storeAddress.push(storeObj);
        //this.loadStores(this.storeAddress);
      });
      this.cd.detectChanges();
    });
  }

  zoomIn() {
    console.log('zoom in');
  }

  zoomOut() {
    console.log('zoom out');
  }

  filterResults(data: any) {
    if(data.length > 0) {
      let tempStoreAddress = [...this.storeAddress];
      if(this.counter === 1) {
        this.storeAddressBackup = Array.from(this.storeAddress);
        this.markersBackup = Array.from(this.markers);
      }
      this.counter++;
      tempStoreAddress.forEach((info, index)=> {
        info.services.forEach((s:any) => {
          const isServicePresent = data.find((d:any) => parseInt(d)===s);
          if(isServicePresent) {
            this.storeAddress.splice(index, 1);
            this.markers.splice(index+1, 1);
          }
        });
      });
      this.cd.detectChanges();
    } else {
        if(this.storeAddressBackup.length !== this.storeAddress.length && this.markersBackup.length !== this.markers.length) {
          this.zone.run(()=>{
            this.storeAddress = JSON.parse(JSON.stringify(this.storeAddressBackup));
            this.markers = [...this.markersBackup];
            this.cd.detectChanges();
          });
        }
    }
  }

  panToLocation(obj: any) {
    const latLng = new google.maps.LatLng(obj.lat, obj.lng);
    this.map.panTo(latLng);
    // const dummyMarker = new google.maps.Marker({
    //   position: latLng
    // });
    this.infoOptions = {
      "pixelOffset": new google.maps.Size(0, -35),  // obj.index === 0 ? new google.maps.Size(0, -42) :
      "position": this.markers[obj.index+1].position,
      "content": this.markers[obj.index+1].info
    };
    this.infoWindow.open(this.mapMarkerDummy);
  }

  decideView() {
    this.listView = !this.listView;
  }

  closeInfoWindow(event: any) {
    this.infoWindow.close();
  }
}
