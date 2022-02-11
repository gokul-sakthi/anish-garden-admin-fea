import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { param } from "jquery";
import { GlobalVariable } from "../../../global";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  baseURL: string = GlobalVariable.BASE_API_URL + "/category";

  getCategories() {
    return this.http.get(this.baseURL);
  }

  saveCategory(data) {
    return this.http.post(this.baseURL, data);
  }

  updateCatgory(id: string, data) {
    console.log(id);

    let params = new HttpParams().append("id", id);
    return this.http.put(this.baseURL, data, { params: params });
  }

  deleteCategory(id: string, deleteAll: boolean) {
    let params = new HttpParams();

    if (deleteAll) {
      params = params.append("all", "true");
    } else {
      params = params.append("id", id);
    }

    return this.http.delete(this.baseURL, { params: params });
  }
}
