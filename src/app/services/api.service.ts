import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  currentDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0,10);
  startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,10);
  private apiUrl = 'https://corona.lmao.ninja/v2/all';

  constructor(private http: HttpClient, private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder) { }

  getGlobalDetails(todaySelected): Observable<any>{
    return this.http.get(this.apiUrl + `?yesterday=${!todaySelected}`, {});
  }

  getUserLocation() {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.geolocation.getCurrentPosition().then(resp => {
      console.log(resp);
      // this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
      //     .then((result: NativeGeocoderResult[]) => {
      //       const userLocation = result[0].toString();
      //     }, error => {
      //       console.log(error);
      //     });
      this.http.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${resp.coords.latitude},${resp.coords.longitude}&sensor=true`).subscribe(res => {
        console.log(resp);
      })
    }, error => {
      console.log('Error getting location', error);
    });

    // let watch = this.geoLocation.watchPosition();
    // watch.subscribe((data) => {
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    //   console.log(data);
    // });
  }

  getCountryDetailsToday(countryName, todaySelected): Observable<any> {
    return this.http.get(`https://corona.lmao.ninja/v2/countries/${countryName}?yesterday=${!todaySelected}&strict=true&query`);
  }

  getWeekData(): Observable<any> {
  return this.http.get(`https://corona.lmao.ninja/v2/historical/India?lastdays=7`);
  }

  getGlobalWeekData(): Observable<any> {
    return this.http.get(`https://corona.lmao.ninja/v2/historical/all`);
  }
}
