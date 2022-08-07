import { ToolbarModule } from "../toolbar/toolbar.module";
import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HomePage } from "./home.page";
import { ExploreContainerComponentModule } from "../explore-container/explore-container.module";

import { HomePageRoutingModule } from "./home-routing.module";
import { HomeChartComponent } from "../shared/components/home-chart/home-chart.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HomePageRoutingModule,
    ToolbarModule,
  ],
  declarations: [HomePage, HomeChartComponent],
})
export class HomePageModule {}
