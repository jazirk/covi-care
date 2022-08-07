import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { ExploreContainerComponentModule } from "../explore-container/explore-container.module";

import { Tab3Page as NewsPage } from "./news.page";

describe("NewsPage", () => {
  let component: NewsPage;
  let fixture: ComponentFixture<NewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
