import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalVariable } from "../../../global";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {}

  root = GlobalVariable.BASE_API_URL;
  baseURL = GlobalVariable.BASE_API_URL + "/products";

  addProduct(formData: FormData) {
    return this.http.post(`${this.baseURL}/addproduct`, formData, {
      reportProgress: true,
    });
  }

  getProducts() {
    return this.http.get(this.baseURL);
  }

  getProductsByQuery(data: object) {
    return this.http.post(this.baseURL + "/query/", data);
  }

  updateStockValue(stockId: string, stockCount: number) {
    console.log("Stock Field Updated");
    console.log(stockId);
    console.log(stockCount);

    let data = {
      stockCount: stockCount,
      id: stockId,
    };

    return this.http.put(this.baseURL + "/stocks/", data);
  }

  updateProduct(id, updatebody) {
    let params = new HttpParams().append("id", id);
    return this.http.put(this.baseURL, updatebody, { params: params });
  }

  deleteProduct(id: string) {
    let params = new HttpParams().append("id", id);
    return this.http.delete(this.baseURL + "/id", { params: params });
  }
}
