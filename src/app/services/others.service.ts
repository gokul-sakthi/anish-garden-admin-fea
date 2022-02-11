import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NetworkResponse } from "app/models/response.model";
import { GlobalVariable } from "../../../global";

@Injectable({
  providedIn: "root",
})
export class OthersService {
  constructor(private http: HttpClient) {}

  baseHomepageURL: string =
    GlobalVariable.BASE_API_URL + "/others/homepagedata";

  getHomepagedata() {
    return this.http.get<NetworkResponse>(this.baseHomepageURL);
  }

  updateHomepagedata(data: any) {
    return this.http.put<NetworkResponse>(this.baseHomepageURL, data);
  }
}
