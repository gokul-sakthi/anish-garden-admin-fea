import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NetworkResponse } from "app/models/response.model";
import { GlobalVariable } from "../../../global";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  baseURL: string = GlobalVariable.BASE_API_URL + "/orders";

  getAllOrders() {
    return this.http.get<NetworkResponse>(this.baseURL);
  }

  getAllOrdersByStatus(status: string = "INITIATED") {
    return this.http.get<NetworkResponse>(this.baseURL, {
      params: new HttpParams().append("status", status),
    });
  }

  selectOrder(orderId: string) {
    return this.http.get<NetworkResponse>(this.baseURL + "/select", {
      params: new HttpParams().append("id", orderId),
    });
  }

  updateOrderStatus(status: string, id: string) {
    return this.http.put<NetworkResponse>(this.baseURL + "/update", {
      status,
      id,
    });
  }
}
