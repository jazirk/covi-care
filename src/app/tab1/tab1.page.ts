import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../services/api.service';
import {map, tap} from 'rxjs/operators';
import {Chart} from 'chart.js';
import {lintSyntaxError} from 'tslint/lib/verify/lintError';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit {

    covidData = {};
    countrySelected = true;
    todaySelected = true;
    chartConfig = {};
    chart;
    @ViewChild('canvas') canvas: ElementRef;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        // this.apiService.getGlobalDetails().subscribe(res => {
        //   this.covidData = {
        //     totalActive : res.active,
        //     today: res.todayCases,
        //     recovered: res.todayRecovered,
        //     deaths: res.todayDeath
        //   }
        // })
        //this.apiService.getUserLocation();
        this.getDetailsToday(true, true);
        this.apiService.getUserLocation();

    }

    ngAfterViewInit() {
        this.getChartData();
    }

    getDetailsToday(today = true, initialLoading?) {
        if (!initialLoading && typeof initialLoading !== 'undefined') {
            this.countrySelected = !this.countrySelected;
            this.getChartData();
        }

        if (typeof initialLoading === 'undefined') {
            this.todaySelected = !this.todaySelected;
        }

        const apiCall = this.countrySelected ? this.apiService.getCountryDetailsToday('India', this.todaySelected) : this.apiService.getGlobalDetails(this.todaySelected);
        apiCall.subscribe(resp => {
            this.covidData = {
                totalActive: resp.active,
                todayCases: resp.todayCases,
                todayRecovered: resp.todayRecovered,
                todayDeaths: resp.todayDeaths,
                totalCases: resp.cases,
                totalRecovered: resp.recovered,
                totalDeaths: resp.deaths
            };
            this.numberCounter();
        });
    }

    numberCounter() {
        const counters = document.querySelectorAll('.counter');
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
        if(this.countrySelected) {
            this.apiService.getWeekData().pipe(map(res => res.timeline)).subscribe(res => {
                dates = Object.keys(res.cases).map(item => new Date(item).toLocaleString('default', {month: 'short', day: 'numeric'}));
                recovered = Object.values(res.recovered);
                cases = Object.values(res.cases);
                deaths = Object.values(res.deaths);
                // cases = res.map(item => item['new_infections']);
                // deaths = res.map(item => item['new_deaths']);
                // dates = res.map(item => new Date(item['last_updated']).toLocaleString('default', {month: 'short', day: 'numeric'}));
                this.chartConfigs(recovered,cases,deaths,dates);
            });
        } else {
            this.apiService.getGlobalWeekData().subscribe(res => {
                const datesArray = Object.keys(res.recovered).slice( Object.keys(res.recovered).length - 7);
                datesArray.forEach(date =>{
                    recovered.push(res.recovered[date]);
                    cases.push(res.cases[date]);
                    deaths.push(res.deaths[date]);
                    dates.push(new Date(date).toLocaleString('default', {month: 'short', day: 'numeric'}));
                    }
                 );
                this.chartConfigs(recovered,cases,deaths,dates);
            });
        }
    }

    chartConfigs(recovered,cases,deaths,dates) {
        this.chart = new Chart('canvas', {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        data: cases,
                        label: 'Cases',
                        borderColor: '#F7971E',
                        fill: false
                    },
                    {
                        data: recovered,
                        label: 'Recovered',
                        borderColor: '#11998e',
                        fill: false
                    },
                    {
                        data: deaths,
                        label: 'Deaths',
                        borderColor: '#93291E',
                        fill: false
                    },
                ]
            },
            options: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        fontSize: 7
                    }
                },
                scales: {
                    xAxes: [{
                        display: true,
                        ticks: {
                            fontSize: 6
                        }
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            callback: function(label, index, labels) {
                                return label / 1000 + 'k';
                            },
                            fontSize: 6
                        },
                    }],
                }
            }
        });

    }


doRefresh(event) {
    this.getDetailsToday(true, false);
    event.target.complete();
}

}

