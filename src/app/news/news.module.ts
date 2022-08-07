import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NewsPage } from "./news.page";
import { ExploreContainerComponentModule } from "../explore-container/explore-container.module";

import { NewsPageRoutingModule } from "./news-routing.module";
import { NewsItemComponent } from "../components/news-item/news-item.component";
import { ToolbarModule } from "../toolbar/toolbar.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: "", component: NewsPage }]),
    NewsPageRoutingModule,
    ToolbarModule,
  ],
  declarations: [NewsPage, NewsItemComponent],
})
export class Tab3PageModule {}
