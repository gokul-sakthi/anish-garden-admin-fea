import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalVariable } from "../../../global";

@Injectable({
  providedIn: "root",
})
export class DiscountService {
  constructor(private http: HttpClient) {}

  baseURL: string = GlobalVariable.BASE_API_URL + "/discounts/";

  getAllDiscounts() {
    return this.http.get(this.baseURL);
  }

  getDiscountedProducts(discountId: string) {
    let params = new HttpParams().append("id", discountId);
    return this.http.get(this.baseURL + "products/", { params: params });
  }

  saveDiscountPlan(data: any) {
    return this.http.post(this.baseURL, data);
  }

  updateDiscountPlan(id: string, data: any) {
    return this.http.put(this.baseURL, data, {
      params: new HttpParams().append("id", id),
    });
  }

  deleteDiscountPlan(id: string) {
    return this.http.delete(this.baseURL, {
      params: new HttpParams().append("id", id),
    });
  }
}
