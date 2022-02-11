import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NetworkResponse } from "app/models/response.model";
import { CategoryService } from "app/services/category.service";
import { ToastrService } from "ngx-toastr";

interface Category {
  name: string;
  _id?: string;
  subCategory: string[];
}

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"],
})
export class CategoriesComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.categoryService
      .getCategories()
      .subscribe((response: NetworkResponse) => {
        if (response.status === "OK") {
          this.allCategories = response.payload;
        } else {
          this.showNotification(
            "top",
            "right",
            "Error getting categories",
            "danger"
          );
        }
      });
  }

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

  tab: string = "viewall";
  editMode: boolean = false;
  allCategories: Category[] = [];

  categoryTobeEdited?: Category;

  categoryForm: FormGroup = this.fb.group({
    name: ["", Validators.required],
    currentSubCategoryEntry: "",
    subCategory: this.fb.array(["Others"]),
  });

  addSubCategory() {
    console.log(this.categoryForm.get("currentSubCategoryEntry"));

    this.getSubCategories().push(
      this.fb.control(
        this.categoryForm.get("currentSubCategoryEntry").value,
        Validators.required
      )
    );
    this.categoryForm.patchValue({
      currentSubCategoryEntry: "",
    });
  }

  getSubCategories() {
    // console.log(this.categoryForm.get("subCategories"));
    return this.categoryForm.get("subCategory") as FormArray;
  }

  removeSubCategory(subcategoryName: number) {
    this.getSubCategories().removeAt(subcategoryName);
  }

  onChangeTab(tab: string) {
    this.tab = tab;
  }

  editCategoryData(value: string) {
    this.editMode = true;
    this.categoryTobeEdited = this.allCategories.find(
      (categoryItem) => categoryItem._id === value
    );
    console.log(this.categoryTobeEdited);
    this.getSubCategories().clear();

    this.categoryForm.patchValue({
      name: this.categoryTobeEdited.name,
    });

    let subCategoryControls = this.getSubCategories();
    this.categoryTobeEdited.subCategory.forEach((item) =>
      subCategoryControls.push(new FormControl(item, Validators.required))
    );
    this.tab = "add";
  }

  deleteCategoryData(value: string, deleteAll: boolean) {
    this.categoryService
      .deleteCategory(value, deleteAll)
      .subscribe((response: NetworkResponse) => {
        if (response.status === "OK") {
          if (deleteAll) {
            this.allCategories = [];
          } else {
            this.allCategories = this.allCategories.filter(
              (item) => item._id !== value
            );
          }
        }
      });
  }

  resetAfter(okResponse: any) {
    this.getSubCategories().clear();
    this.getSubCategories().push(this.fb.control("All"));
    this.showNotification(
      "top",
      "right",
      okResponse.operation === "Edit"
        ? "Category successfully edited"
        : "Category successfully saved",
      okResponse.statusOK ? "success" : "danger"
    );

    this.categoryService
      .getCategories()
      .subscribe((response: NetworkResponse) => {
        if (response.status === "OK") this.allCategories = response.payload;
        else
          this.showNotification(
            "top",
            "right",
            "Error in getting updated categories",
            "danger"
          );
      });

    if (okResponse.operation === "Edit") this.tab = "viewall";
  }

  submit() {
    console.log("Submitted data");
    console.log(this.categoryForm.value);
    let okResponse: { statusOK: boolean; operation: string } = {
      statusOK: true,
      operation: this.editMode ? "Edit" : "Add",
    };

    if (this.editMode) {
      this.categoryService
        .updateCatgory(this.categoryTobeEdited._id, this.categoryForm.value)
        .subscribe((response: NetworkResponse) => {
          if (response.status === "ERR") {
            okResponse.statusOK = false;
          } else {
            this.categoryTobeEdited = null;
            this.editMode = false;
          }

          this.resetAfter(okResponse);
        });
    } else {
      this.categoryService
        .saveCategory(this.categoryForm.value)
        .subscribe((response: NetworkResponse) => {
          if (response.status === "ERR") {
            okResponse.statusOK = false;
          }
          this.resetAfter(okResponse);
        });
    }
  }
}
