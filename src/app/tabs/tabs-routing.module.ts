import { HomePageModule } from "./../home/home.module";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "app",
    component: TabsPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("../home/home.module").then((m) => m.HomePageModule),
      },
      {
        path: "tab2",
        loadChildren: () =>
          import("../tab2/tab2.module").then((m) => m.Tab2PageModule),
      },
      {
        path: "news",
        loadChildren: () =>
          import("../news/news.module").then((m) => m.Tab3PageModule),
      },
      {
        path: "",
        redirectTo: "/app/home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/app/home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
