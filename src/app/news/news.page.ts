import { Component, OnInit, ViewChild } from "@angular/core";
import { IonInfiniteScroll } from "@ionic/angular";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-news",
  templateUrl: "news.page.html",
  styleUrls: ["news.page.scss"],
})
export class NewsPage implements OnInit {
  newsData = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getTopNews("in").subscribe((res) => {
      this.newsData = res;
    });
  }

  loadData(event) {
    setTimeout(() => {
      console.log("Done");
      event.target.complete();

      //App logic to determine if all data is loaded
      //and disable the infinite scroll
      if (this.newsData.length === 70) {
        event.target.disabled = true;
      }
    }, 500);
  }
}
