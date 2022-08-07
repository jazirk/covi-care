import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Chart } from "chart.js";

@Component({
  selector: "app-home-chart",
  templateUrl: "./home-chart.component.html",
  styleUrls: ["./home-chart.component.scss"],
})
export class HomeChartComponent implements OnInit {
  chart;
  @Input() chartConfig;
  @ViewChild("canvas") canvas: ElementRef;

  constructor() {}

  ngOnInit() {
    console.log(this.chartConfig);
    this.chart = new Chart(
      <HTMLCanvasElement>document.getElementById("canvas"),
      this.chartConfig
    );
  }

  // ngAfterViewInit() {
  //   console.log(document.getElementById('canvas'));
  //   this.chart = new Chart(document.getElementById('canvas'), this.chartConfig);
  // }
}
