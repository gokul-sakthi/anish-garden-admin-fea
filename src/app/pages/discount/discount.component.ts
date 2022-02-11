import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, NgForm } from "@angular/forms";
import { NetworkResponse } from "app/models/response.model";
import { DiscountService } from "app/services/discount.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-discount",
  templateUrl: "./discount.component.html",
  styleUrls: ["./discount.component.css"],
})
export class DiscountComponent implements OnInit {
  constructor(
    private discountService: DiscountService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshPlans();
  }

  discountForm = this.fb.group({
    name: this.fb.control(""),
    description: this.fb.control(""),
    discountPrice: this.fb.control(""),
    products: this.fb.control(""),
  });

  tab: string = "add";

  editMode: boolean = false;

  discountList: any[] = [];

  onChangeTab(tab: string) {
    this.tab = tab;
  }

  planToBeEdited: any = undefined;

  populatedDiscountProudcts: any;

  showNotification(from, align, message: string, status: string) {
    const color = Math.floor(Math.random() * 5 + 1);

    switch (color) {
      case 1:
        this.toastr.info(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: `alert alert-${status} alert-with-icon`,
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 2:
        this.toastr.success(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: `alert alert-${status} alert-with-icon`,
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 3:
        this.toastr.warning(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: `alert alert-${status} alert-with-icon`,
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 4:
        this.toastr.error(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">${message}</span>`,
          "",
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: `alert alert-${status} alert-with-icon`,
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      case 5:
        this.toastr.show(
          `<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">${message}</span>`,
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: `alert alert-${status} alert-with-icon`,
            positionClass: "toast-" + from + "-" + align,
          }
        );
        break;
      default:
        break;
    }
  }

  populateDiscountPlan(id: string) {
    this.discountService.getDiscountedProducts(id).subscribe(
      (response: NetworkResponse) => {
        if (response.status === "OK") {
          this.populatedDiscountProudcts = response.payload;
        } else {
          this.showNotification(
            "top",
            "right",
            "Something went wrong",
            "danger"
          );
        }
      },
      (err) => {
        this.showNotification("top", "right", "Something went wrong", "danger");
      }
    );
  }

  resetPopulatedPlans() {
    this.populatedDiscountProudcts = [];
  }

  enterEditMode(foundProduct: any) {
    this.tab = "add";
    this.editMode = true;
    console.log(foundProduct);

    this.planToBeEdited = foundProduct;

    this.discountForm.reset({
      name: foundProduct.name,
      description: foundProduct.description,
      discountPrice: foundProduct.discountPrice,
      products: (<[]>foundProduct.products).join(",").toString(),
    });
  }

  deletePlan(item: any) {
    this.discountService
      .deleteDiscountPlan(item._id)
      .subscribe((response: NetworkResponse) => {
        if (response.status === "OK") {
          this.discountList = this.discountList.filter(
            (products) => products._id !== item._id
          );
          this.showNotification(
            "top",
            "right",
            "Discount Plan Deleted Successfully",
            "success"
          );
        } else {
          this.showNotification(
            "top",
            "right",
            "Something went wrong",
            "danger"
          );
        }
      });
  }

  refreshPlans() {
    this.discountService.getAllDiscounts().subscribe(
      (response: NetworkResponse) => {
        if (response.status === "OK") {
          this.discountList = response.payload;
        } else {
          this.showNotification(
            "top",
            "right",
            "Something went wrong",
            "danger"
          );
        }
      },
      (err) => {
        this.showNotification("top", "right", "Something went wrong", "danger");
      }
    );
  }

  submitDiscountPlan() {
    let discountPlanValue = this.discountForm.value;
    discountPlanValue.products = (discountPlanValue.products || "")
      .toString()
      .split(",");

    if (this.editMode) {
      this.discountService
        .updateDiscountPlan(this.planToBeEdited._id, discountPlanValue)
        .subscribe((response: NetworkResponse) => {
          if (response.status === "OK") {
            this.editMode = false;
            this.tab = "viewall";
            this.showNotification(
              "top",
              "right",
              "Discount Plan Edited Successfully",
              "success"
            );
            this.refreshPlans();
          } else {
            this.showNotification(
              "top",
              "right",
              "Something went wrong",
              "danger"
            );
          }
        });
    } else {
      this.discountService
        .saveDiscountPlan(discountPlanValue)
        .subscribe((response: NetworkResponse) => {
          if (response.status === "OK") {
            this.refreshPlans();
            this.showNotification(
              "top",
              "right",
              "Discount Plan Saved Successfully",
              "success"
            );
          } else {
            this.showNotification(
              "top",
              "right",
              "Something went wrong",
              "danger"
            );
          }
        });
    }
  }
}
