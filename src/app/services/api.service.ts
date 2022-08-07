import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderResult,
} from "@ionic-native/native-geocoder/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { map } from "rxjs/operators";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  currentDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  private apiUrl = "https://api.covid19api.com/summary";

  constructor(
    private http: HttpClient,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) {}

  getGlobalDetails(todaySelected): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      map((response: any) => {
        const globalData = response.Global;
        return {
          totalCases: globalData.TotalConfirmed - globalData.NewConfirmed,
          totalRecovered: globalData.TotalRecovered - globalData.NewRecovered,
          totalDeaths: globalData.TotalDeaths - globalData.NewDeaths,
          todayCases: globalData.NewConfirmed,
          todayDeaths: globalData.NewDeaths,
          todayRecovered: globalData.NewRecovered,
        };
      })
    );
  }

  getUserLocation() {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    this.geolocation.getCurrentPosition().then(
      (resp) => {
        console.log(resp);
        // this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
        //     .then((result: NativeGeocoderResult[]) => {
        //       const userLocation = result[0].toString();
        //     }, error => {
        //       console.log(error);
        //     });
        this.http
          .get(
            `http://maps.googleapis.com/maps/api/geocode/json?latlng=${resp.coords.latitude},${resp.coords.longitude}&sensor=true`
          )
          .subscribe((res) => {
            console.log(resp);
          });
      },
      (error) => {
        console.log("Error getting location", error);
      }
    );

    // let watch = this.geoLocation.watchPosition();
    // watch.subscribe((data) => {
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    //   console.log(data);
    // });
  }

  getCountryDetailsToday(countryName, todaySelected): Observable<any> {
    return this.http
      .get(`https://api.covid19api.com/total/country/${countryName}`)
      .pipe(
        map((response: any) => {
          const today = todaySelected
            ? response[response.length - 1]
            : response[response.length - 2];
          const yesterday = todaySelected
            ? response[response.length - 2]
            : response[response.length - 3];
          return {
            totalActive: today.Active,
            todayCases: today.Confirmed - yesterday.Confirmed,
            todayRecovered: today.Recovered - yesterday.Recovered,
            todayDeaths: today.Deaths - yesterday.Deaths,
            totalCases: yesterday.Confirmed,
            totalRecovered: yesterday.Recovered,
            totalDeaths: yesterday.Deaths,
          };
        })
      );
  }

  getWeekData(countryName): Observable<any> {
    return this.http
      .get(`https://api.covid19api.com/total/country/${countryName}`)
      .pipe(
        map((response: any) => {
          return response
            .filter((data, index) => {
              return index % 30 === 0;
            })
            .slice(-12);
        })
      );
  }

  // getGlobalWeekData(): Observable<any> {
  //   return this.http.get(`https://corona.lmao.ninja/v2/historical/all`);
  // }

  getTopNews(country) {
    return this.http
      .get(
        `https://newsapi.org/v2/top-headlines?country=${country}&category=health&apiKey=9cf20bf95fcc488bad39093d194df9fa`
      )
      .pipe(
        map((response: any) => {
          console.log(response);
          const articles = response.articles;
          return articles
            .filter(
              (article) =>
                article?.title?.length > 0 &&
                article?.description?.length > 0 &&
                article?.urlToImage?.length > 0
            )
            .map((article) => {
              return {
                title: article.title,
                description: article.content,
                url: article.url,
                author: article.author,
                urlToImage: article.urlToImage,

                publishedAt: moment(article.publishedAt).format(
                  "MMM Do YYYY HH:mm"
                ),
              };
            });
        })
      );
  }
}
