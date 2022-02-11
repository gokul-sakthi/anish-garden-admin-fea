import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class IdGeneratorService {
  constructor() {}

  generateIDUsingTime() {
    return +new Date();
  }

  generateUniqueId(type: String = "") {
    switch (type) {
      case "timestamp":
        return this.generateIDUsingTime();

      default:
        return this.generateIDUsingTime();
    }
  }
}
