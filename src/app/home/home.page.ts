import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ApiService } from "../services/api.service";
import Chart from "chart.js/auto";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit, AfterViewInit {
  covidData = {};
  countrySelected = true;
  todaySelected = true;
  chartConfig = {};
  chart;
  @ViewChild("canvas") canvas: ElementRef;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getDetailsToday(true, true);
    this.apiService.getUserLocation();
  }

  ngAfterViewInit() {
    this.getChartData();
  }

  getDetailsToday(today = true, initialLoading?) {
    if (!initialLoading && typeof initialLoading !== "undefined") {
      this.countrySelected = !this.countrySelected;
      this.getChartData();
    }

    if (typeof initialLoading === "undefined") {
      this.todaySelected = !this.todaySelected;
    }

    const apiCall = this.countrySelected
      ? this.apiService.getCountryDetailsToday("India", this.todaySelected)
      : this.apiService.getGlobalDetails(this.todaySelected);
    apiCall.subscribe((resp) => {
      console.log(resp);
      this.covidData = {
        totalActive: resp?.totalActive,
        todayCases: resp.todayCases,
        todayRecovered: resp.todayRecovered,
        todayDeaths: resp.todayDeaths,
        totalCases: resp.totalCases,
        totalRecovered: resp.totalRecovered,
        totalDeaths: resp.totalDeaths,
      };
      this.numberCounter();
    });
  }

  numberCounter() {
    const counters = document.querySelectorAll(".counter");
    const speed = 200; // The lower the slower

    counters.forEach((counter: HTMLParagraphElement, index) => {
      const updateCount = () => {
        const target = +this.covidData[Object.keys(this.covidData)[index]];
        const count = +counter.innerText;

        // Lower inc to slow and higher to slow
        const inc = target / speed;

        // console.log(inc);
        // console.log(count);

        // Check if target is reached
        if (count < target) {
          // Add inc to count and output in counter
          counter.innerText = String(Math.ceil(count + inc));
          // Call function every ms
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = String(target);
        }
      };

      updateCount();
    });
  }

  getChartData() {
    let recovered = [];
    let cases = [];
    let deaths = [];
    let dates = [];
    if (this.countrySelected) {
      this.apiService.getWeekData("india").subscribe(
        (res) => {
          res.forEach((ele) => {
            recovered.push(ele.Recovered);
            cases.push(ele.Confirmed);
            deaths.push(ele.Deaths);
            dates.push(
              new Date(ele.Date)
                .toLocaleString("default", {
                  month: "short",
                  day: "numeric",
                })
                .split(" ")[1]
            );
          });
        },
        (err) => {
          throw err;
          // cases = res.map(item => item['new_infections']);
          // deaths = res.map(item => item['new_deaths']);
          // dates = res.map(item => new Date(item['last_updated']).toLocaleString('default', {month: 'short', day: 'numeric'}));
        }
      );
      this.chartConfigs(recovered, cases, deaths, dates);
    } else {
      //   this.apiService.getGlobalWeekData().subscribe((res) => {
      //     const datesArray = Object.keys(res.recovered).slice(
      //       Object.keys(res.recovered).length - 7
      //     );
      //     datesArray.forEach((date) => {
      //       recovered.push(res.recovered[date]);
      //       cases.push(res.cases[date]);
      //       deaths.push(res.deaths[date]);
      //       dates.push(
      //         new Date(date).toLocaleString("default", {
      //           month: "short",
      //           day: "numeric",
      //         })
      //       );
      //     });
      //     this.chartConfigs(recovered, cases, deaths, dates);
      //   });
    }
  }

  chartConfigs(recovered, cases, deaths, dates) {
    this.chart = new Chart(
      <HTMLCanvasElement>document.getElementById("canvas"),
      {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              data: cases,
              label: "Cases",
              borderColor: "#F7971E",
              fill: false,
            },
            //   {
            //     data: recovered,
            //     label: "Recovered",
            //     borderColor: "#11998e",
            //     fill: false,
            //   },
            {
              data: deaths,
              label: "Deaths",
              borderColor: "#93291E",
              fill: false,
            },
          ],
        },

        options: {
          plugins: {
            legend: {
              display: true,
              position: "top",
              align: "end",
              maxWidth: 20,
              labels: {
                color: "rgb(255, 99, 132)",
                boxWidth: 10,
                boxHeight: 10,
                padding: 10,
              },
            },
          },
          animations: {
            tension: {
              duration: 1000,
              easing: "linear",
              from: 1,
              to: 0,
              loop: true,
            },
          },
          scales: {
            x: {
              display: true,
              ticks: {
                //   fontSize: 5,
              },
            },
            y: {
              display: false,
              alignToPixels: true,
              ticks: {
                callback: this.getFormattedValue,
                stepSize: 10000,
                count: 10,
              },
            },
          },
        },
      }
    );
  }

  getFormattedValue(num, index, values) {
    if (Number(num) >= 1000000000) {
      return (+num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
    }
    if (+num >= 1000000) {
      return (+num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (+num >= 1000) {
      return (+num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return +num;
  }

  doRefresh(event) {
    this.getDetailsToday(true, false);
    event.target.complete();
  }
}
