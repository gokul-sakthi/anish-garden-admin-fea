import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalVariable } from "../../../global";

@Injectable({
  providedIn: "root",
})
export class CollectionsService {
  constructor(private http: HttpClient) {}

  baseURL: string = GlobalVariable.BASE_API_URL + "/collections";

  getallCollections() {
    return this.http.get(this.baseURL);
  }

  saveCollection(data) {
    return this.http.post(this.baseURL, data);
  }

  updateCollection(id: string | null, data) {
    let params = new HttpParams().append("id", id);

    return this.http.put(this.baseURL, data, { params: params });
  }

  deleteCollections(id: string | null, deleteAll: boolean) {
    let params;
    if (id === null && deleteAll === true) {
      params = new HttpParams().append("all", "true");
    } else if (id !== null) {
      params = new HttpParams().append("id", id);
    }

    return this.http.delete(this.baseURL, { params: params });
  }
}
