import { Component, OnInit } from "@angular/core";
import { NetworkResponse } from "app/models/response.model";
import { AlertService } from "app/services/alert.service";
import { OrdersService } from "app/services/orders.services";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"],
})
export class OrdersComponent implements OnInit {
  constructor(
    private ordersService: OrdersService,
    private alertService: AlertService
  ) {}

  showSpinner: boolean = false;
  placedOrders: any[] = [];
  approvedOrders: any[] = [];
  deliveredOrders: any[] = [];
  cancelledOrders: any[] = [];

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.showSpinner = true;
    this.ordersService.getAllOrders().subscribe(
      (response: NetworkResponse) => {
        if (response.status === "OK") {
          console.log(response.payload);

          this.placedOrders =
            response.payload.find((item) => item._id === "INITIATED") || [];
          this.approvedOrders =
            response.payload.find((item) => item._id === "APPROVED") || [];
          this.deliveredOrders =
            response.payload.find((item) => item._id === "DELIVERED") || [];
          this.cancelledOrders =
            response.payload.find((item) => item._id === "CANCELLED") || [];
          this.alertService.successMessage("Orders Updated");
        } else {
          this.alertService.failureMessage("Something went wrong");
        }
        this.showSpinner = false;
      },
      (err) => {
        this.alertService.failureMessage("Something went wrong");
        this.showSpinner = false;
      }
    );
  }

  tab: string = "detailed";
  onChangeTab(tab: string) {
    this.tab = tab;
  }

  selectedOrder: any = {
    _id: "61ad880a89f051e1b4dfab60",
    userId: {
      _id: "61a6e97f24ca50a4850f71b7",
      fullName: "Ellie",
      email: "ellie@gmail.com",
      role: "user",
      billingAddress: "123 Hyrakuren Platoon",
      phone: "1234567890",
      createdAt: "2021-12-01T03:18:23.860Z",
      updatedAt: "2021-12-13T04:07:46.950Z",
      __v: 0,
    },
    productId: {
      _id: "61ac6a0ec7e4b4ff9e799340",
      name: "Test Product 2",
      stocks: 0,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      price: 200,
      discountedPrice: 0,
      category: "Plants",
      subCategory: "Dry Plants",
      tags: ["200"],
      createdAt: "2021-12-05T07:28:14.150Z",
      updatedAt: "2021-12-06T12:47:07.126Z",
      __v: 0,
    },
    quantity: 1,
    status: "INITIATED",
    amount: 200,
    discountedAmount: "200",
    __v: 0,
    createdAt: "2021-12-06T03:48:26.906Z",
    updatedAt: "2021-12-06T03:48:26.906Z",
  };

  selectOrder(id: string) {
    this.tab = "detailed";
    this.showSpinner = true;
    this.ordersService.selectOrder(id).subscribe(
      (response: NetworkResponse) => {
        if (response.status === "OK") {
          this.selectedOrder = response.payload;
        } else {
          this.alertService.failureMessage("Cannot Fetch Details of Order");
        }
        console.log(response);
        this.showSpinner = false;
      },
      (err) => {
        this.showSpinner = false;
        this.alertService.failureMessage("Something went wrong");
      }
    );
  }

  changeOrderStatus(status: string) {
    this.ordersService
      .updateOrderStatus(status, this.selectedOrder._id)
      .subscribe(
        (response: NetworkResponse) => {
          if (response.status === "OK") {
            console.log("Order Status");

            console.log(response);

            this.alertService.successMessage("Order Status Updated");
            this.selectedOrder.status = response.payload.status;
          } else {
            this.alertService.failureMessage(
              "Something went wrong in updating order"
            );
          }
        },
        (err) => {
          this.alertService.failureMessage(
            "Something went wrong in updating order"
          );
        }
      );
  }
}
