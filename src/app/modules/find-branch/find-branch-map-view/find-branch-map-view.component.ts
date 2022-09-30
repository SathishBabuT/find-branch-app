import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-find-branch-map-view',
  templateUrl: './find-branch-map-view.component.html',
  styleUrls: ['./find-branch-map-view.component.scss']
})
export class FindBranchMapViewComponent implements OnInit {
  //apiLoaded: Observable<boolean>;
  mapOptions: google.maps.MapOptions = {
    zoom : 14,
    zoomControl: true,
    streetViewControl: true,
    maxZoom: 16,
    minZoom: 4
  }
  center: any;
  markers: any[] = [];
  location_logo = { "url": "../assets/bawag_indicator.png", scaledSize: new google.maps.Size(50, 50)};
  infoOptions = {};
  storeAddress: any[] = [];
  listView: boolean = true;
  mobileMode: string;
  @ViewChild('googleMap', { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild('mapMarker') mapMarkerDummy: MapMarker;
  //@ViewChild(MapInfoWindow) infoWindowViews: QueryList<MapInfoWindow>;
  constructor(private httpClient: HttpClient, private cd: ChangeDetectorRef) {
    this.mobileMode = navigator.userAgent;
  }

  ngOnInit(): void {
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

    this.httpClient.get<any>('../../../../assets/mocks/api/stores.json').subscribe(response => {
      this.markers.push({
        "position": { "lat": response.map.lat, "lng": response.map.lng},
        "options": {
          "animation": google.maps.Animation.DROP
        },
        "icon": "https://www.google.com/mapfiles/marker.png"
      })
      const walk="../../../../assets/walk.png";
      response.stores.forEach((res: any, index: number)=> {
        const markerObj = {
          "position": { "lat": res.map.lat, "lng": res.map.lng },
          "options": {
            "animation": google.maps.Animation.DROP
          },
          "icon": this.location_logo,
          "info": '<div id="content">' + '<h5 class="heading">'+ res.title +'</h5>' +
                    '<div id="bodyContent">' +
                    "<span><b>"
                    + res.info.address.street +"</b></span><br><span><b>"+ res.info.address.plz + ' ' + res.info.address.city + "</b></span><br><span><img src="+ walk +">"+ res.info.distanceCalc +"</b></span></div></div>"
        };
        this.markers.push(markerObj);
        const storeObj = {
          "street": res.info.address.street,
          "zip": res.info.address.plz,
          "city": res.info.address.city,
          "state": res.info.address.state,
          "address": res.info.address.street+ ', '+res.info.address.city,
          "distance": res.info.distanceCalc,
          "phone": res.info.phone,
          "email": res.info.email.split('@')[0],
          "title": res.title,
          "lat": res.map.lat,
          "lng": res.map.lng
        }
        this.storeAddress.push(storeObj);
      });
      this.cd.detectChanges();
    });

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: 48.21100,
        lng: 16.3718
      }
    });

    // https://filialsuche.bawag.at/BAWAGPSK/PK/filialsuche/269546/filialsuche.html?view=asQuery&onlineSales=&maxItems=10&andFilter=true&simple=true&requiredServices=&wsCall=true&lat=48.2088364&lng=16.3734791&postal_code=1010&city=Wien&street=Stephansplatz&locationFilter=address&timestamp=1664286298519&environments=&services=&languages=&storefinderType=simple
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

  openInfoWindow(marker: MapMarker, contentString: string) {
    this.infoOptions = {
      content: contentString
    };
    this.infoWindow.open(marker);
  }

  zoomIn() {
    console.log('zoom in');
  }

  zoomOut() {
    console.log('zoom out');
  }

  filterResults(data: any) {
    console.log(data);
  }

  panToLocation(obj: any) {
    const latLng = new google.maps.LatLng(obj.lat, obj.lng);
    this.map.panTo(latLng);
    //this.openInfoWindow(this.markers[obj.index], this.markers[obj.index].info);
  }

  decideView() {
    this.listView = !this.listView;
  }
}
