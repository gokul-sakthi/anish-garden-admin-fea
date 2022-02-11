import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NetworkResponse } from "app/models/response.model";
import { CollectionsService } from "app/services/collections.service";

import { ToastrService } from "ngx-toastr";

interface CollectionItem {
  name: string;
  description: string;
  products: string[];
  _id: string;
}

@Component({
  selector: "app-collections",
  templateUrl: "./collections.component.html",
  styleUrls: ["./collections.component.css"],
})
export class CollectionsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.collectionService.getallCollections().subscribe(
      (response: NetworkResponse) => {
        if (response.status === "OK") {
          this.collectionsList = response.payload;
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

  collectionsList: CollectionItem[] = [];

  collectionIdToBeEdited: string;

  editMode: boolean = false;

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

  collectionsForm: FormGroup = this.fb.group({
    name: ["", Validators.required],
    currentProductIdEntry: "",
    description: ["", [Validators.required, Validators.minLength(15)]],
    products: this.fb.array([]),
  });

  getProducts() {
    return this.collectionsForm.get("products") as FormArray;
  }

  setCurrentProductIdentry(id: string) {
    this.collectionsForm.patchValue({
      currentProductIdEntry: id,
    });
  }

  addProductToCollection() {
    this.getProducts().push(
      this.fb.control(
        this.collectionsForm.get("currentProductIdEntry").value,
        Validators.required
      )
    );
    this.collectionsForm.patchValue({
      currentProductIdEntry: "",
    });
  }

  removeProductFromCollection(productIndex: number) {
    this.getProducts().removeAt(productIndex);
  }

  editCollection(collectionItem: CollectionItem) {
    console.log(this.collectionsList);

    this.editMode = true;
    this.collectionIdToBeEdited = collectionItem._id;
    this.collectionsForm.reset({
      name: collectionItem.name,
      description: collectionItem.description,
      currentProductIdEntry: "",
    });

    let collectionProducts = this.getProducts();
    collectionProducts.clear();
    collectionItem.products.forEach((item: string) => {
      collectionProducts.push(this.fb.control(item, Validators.required));
    });
  }

  deleteCollection(collectionItem: CollectionItem) {
    this.collectionService
      .deleteCollections(collectionItem._id, false)
      .subscribe(
        (response: NetworkResponse) => {
          if (response.status === "OK") {
            this.collectionsList = this.collectionsList.filter(
              (item: CollectionItem) => item._id !== collectionItem._id
            );
          }

          this.showNotification(
            "top",
            "right",
            response.status === "OK"
              ? "Collection Deleted Successfully"
              : "Error in Deleting Collection",
            response.status === "OK" ? "success" : "danger"
          );
        },
        (err) => {
          this.showNotification(
            "top",
            "right",
            "Something went wrong",
            "danger"
          );
        }
      );
  }

  resetForm() {
    this.getProducts().clear();
    this.collectionsForm.reset();
    this.collectionIdToBeEdited = null;
  }

  resetAfter(okResponse: { statusOK: boolean; operation: string }) {
    let notif: { message: string; level: string } = {
      message: "",
      level: "success",
    };

    if (okResponse.operation === "edit" && okResponse.statusOK) {
      notif.message = "Edit Successful";
    } else if (okResponse.operation === "edit" && !okResponse.statusOK) {
      notif = {
        message: "Error in Editing collection",
        level: "danger",
      };
    } else if (okResponse.operation === "add" && okResponse.statusOK) {
      notif.message = "Adding Collection Successful";
    } else if (okResponse.operation === "add" && !okResponse.statusOK) {
      notif = {
        message: "Error in Adding collection",
        level: "danger",
      };
    }

    if (okResponse.statusOK) {
      this.getProducts().clear();
      this.collectionsForm.reset();
      this.editMode = false;
    }

    this.showNotification("top", "right", notif.message, notif.level);
  }

  submitCollection() {
    let okResponse: { statusOK: boolean; operation: string } = {
      statusOK: true,
      operation: "add",
    };
    console.log("Collection Submitted");
    let finalData = this.collectionsForm.value;
    delete finalData.currentProductIdEntry;

    if (this.editMode) {
      okResponse.operation = "edit";
      this.collectionService
        .updateCollection(this.collectionIdToBeEdited, finalData)
        .subscribe((response: NetworkResponse) => {
          if (response.status === "ERR") okResponse.statusOK = false;
          else {
            this.collectionsList = this.collectionsList.map(
              (item: CollectionItem) => {
                if (item._id === response.payload._id) item = response.payload;
                return item;
              }
            );
          }

          this.resetAfter(okResponse);
        });
    } else {
      this.collectionService
        .saveCollection(finalData)
        .subscribe((response: NetworkResponse) => {
          if (response.status === "ERR") okResponse.statusOK = false;
          else {
            this.collectionsList = [...this.collectionsList, response.payload];
          }
          this.resetAfter(okResponse);
        });
    }
  }
}
