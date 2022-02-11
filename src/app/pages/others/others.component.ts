import { Component, OnInit } from "@angular/core";
import { NetworkResponse } from "app/models/response.model";
import { AlertService } from "app/services/alert.service";
import { CategoryService } from "app/services/category.service";
import { OthersService } from "app/services/others.service";
import { ProductService } from "app/services/product-service";
import { ToastrService } from "ngx-toastr";

interface Category {
  name: string;
  _id?: string;
  subCategory: string[];
}

@Component({
  selector: "app-others",
  templateUrl: "./others.component.html",
  styleUrls: ["./others.component.css"],
})
export class OthersComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private alertService: AlertService,
    private othersService: OthersService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(
      (response: NetworkResponse) => {
        if (response.status === "OK") {
          this.categories = response.payload;
        } else this.alertService.failureMessage("Something went wrong");
      },
      (err) => {
        this.alertService.failureMessage("Something went wrong");
      }
    );
  }

  tab: string = "stocks";
  onChangeTab(tab: string) {
    this.tab = tab;
  }

  // Categories ***************

  categories: Category[] = [];
  subCategories: any[];

  currentCategory: Category;
  currentSubCategory: any;

  selectCategory(categoryItem: Category) {
    this.currentCategory = categoryItem;
    this.currentSubCategory = undefined;
    this.subCategories = this.currentCategory.subCategory;
  }

  selectSubCategory(subCategoryItem: string) {
    this.currentSubCategory = subCategoryItem;
  }

  applyFilter() {
    let filters = {
      query: {
        category: [this.currentCategory.name],
        subCategory: [this.currentSubCategory],
      },
    };

    this.productService.getProductsByQuery(filters).subscribe(
      (response: NetworkResponse) => {
        if (response.status === "OK") {
          this.productStockList = response.payload;
          this.alertService.successMessage("Stock List Fetched");
        } else this.alertService.failureMessage("Something went wrong");
      },
      (err) => {
        this.alertService.failureMessage("Something went wrong");
      }
    );
  }

  clearFilters() {
    this.currentCategory = undefined;
    this.currentSubCategory = undefined;
  }

  // display list
  productStockList: any[] = [];

  updateStockValue(productId: string, updatedStockCount: number) {
    this.productService
      .updateStockValue(productId, updatedStockCount)
      .subscribe(
        (response: NetworkResponse) => {
          if (response.status === "OK") {
            this.productStockList = this.productStockList.map((item) => {
              return item._id === productId ? response.payload : item;
            });
            this.alertService.successMessage("Stocks updated");
          } else this.alertService.failureMessage("Couldn't update the stocks");
        },
        (err) => {
          this.alertService.failureMessage("Something went wrong");
        }
      );
  }

  // Homepage data
  carouselImageUrls: string = "";
  discountSectionFiller: string = "";

  updateHomePageData() {
    this.othersService
      .updateHomepagedata({
        images: this.carouselImageUrls.split(","),
        discounttext: this.discountSectionFiller.split(","),
      })
      .subscribe(
        (response: NetworkResponse) => {
          this.carouselImageUrls =
            response.payload.homepage.carousel.images.join(",");
          this.discountSectionFiller =
            response.payload.homepage.discountSection.text.join(",");
          this.alertService.successMessage("Homepage data updated");
        },
        (errr) => {
          this.alertService.failureMessage("Something went wrong");
        }
      );
  }

  getHomepageData() {
    this.othersService.getHomepagedata().subscribe(
      (response: NetworkResponse) => {
        this.carouselImageUrls =
          response.payload.homepage.carousel.images.join(",");
        this.discountSectionFiller =
          response.payload.homepage.discountSection.text.join(",");
      },
      (err) => {
        this.alertService.failureMessage("Something went wrong");
      }
    );
  }
}
