import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { NetworkResponse } from "app/models/response.model";
import { CategoryService } from "app/services/category.service";
import { IdGeneratorService } from "app/services/id-generator.service";
import { ProductService } from "app/services/product-service";
import { ToastrService } from "ngx-toastr";

interface FilePreviewType {
  filename?: string;
  size?: number;
  file: any | Blob;
  id: number;
}

interface Category {
  name: string;
  _id?: string;
  subCategory: string[];
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  price: string;
  discountedPrice?: string;
  stocks: number;
  images: string[];
  thumbnail: Object;
  tags: string[];
}

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private idService: IdGeneratorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (response: NetworkResponse) => {
        this.products = response.payload;
      },
      (err) => {
        this.showNotification("top", "right", "Something went wrong", "danger");
      }
    );
    this.categoryService.getCategories().subscribe(
      (response: NetworkResponse) => {
        this.category = response.payload;
      },
      (err) => {
        this.showNotification("top", "right", "Something went wrong", "danger");
      }
    );
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

  // Images
  myFiles: any[] = [];
  previewImages: FilePreviewType[] = [];
  previewImageTotalSize: number = 0;

  // thumbnail
  thumbnail: any;
  thumbnailPreview: FilePreviewType | any = undefined;
  thumbnailPreviewTotalSize: number = 0;

  // max number of images to be added
  maxImageFileCount: number = 4;

  // size to appropriate denominations
  fsExt: string[] = ["Bytes", "KB", "MB", "GB"];

  // product
  products: Product[] = [];

  // category
  category: Category[] = [];

  subCategory: any[] = [];

  currentCategory!: Category;
  currentSubCategory!: String;

  // reactive form
  myForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    description: new FormControl("", [
      Validators.required,
      Validators.minLength(15),
    ]),
    thumbnail: new FormControl(""),
    price: new FormControl(0, [Validators.min(0), Validators.required]),
    stocks: new FormControl(0, [Validators.min(0)]),
    category: new FormControl("", Validators.required),
    subCategory: new FormControl("", Validators.required),
    images: new FormControl(""),
    tags: new FormArray([]),
  });

  tags: Set<string> = new Set([]);

  // tab control
  tab: string = "viewall";

  // editMode
  editMode: boolean = false;
  editProductId: string;

  enterEditMode(indexOfProduct: number) {
    this.editMode = true;
    this.tab = "add";
    let productItem: Product = this.products[indexOfProduct];
    this.editProductId = productItem._id;
    this.selectCategory(this.findCategory(productItem.category));
    this.selectSubCategory(productItem.subCategory);
    console.log(productItem);

    this.myForm.setValue({
      name: productItem.name,
      description: productItem.description,
      price: productItem.price,
      stocks: productItem.stocks,
      category: productItem.category,
      subCategory: productItem.subCategory,
      tags: [],
      thumbnail: null,
      images: null,
    });

    this.tags = new Set(productItem.tags);
  }

  // ***************************************** Format helper methods START *******************************************
  // format file name to truncate to 17 words or less
  formatFilename(name: string) {
    let nameList = name.split(".");

    if (nameList[0].length > 20) {
      nameList[0] = nameList[0].substring(0, 17) + "...";
    }

    return nameList.join(".");
  }

  // convert to byte kb mb or gb
  formatMemorySize(size: number, precision: number = 2): string {
    let i = 0;
    while (size > 900) {
      size /= 1024;
      i++;
    }
    return ((size * 100) / 100).toFixed(precision) + " " + this.fsExt[i];
  }
  // ***************************************** Format helper methods END *******************************************

  // change the tab create/ view all
  onChangeTab(value: string) {
    this.tab = value;
  }

  // **************************************************** Image Field content START ************************************************

  /* Read file one by one using the file reader using the onloadend event. 
  after adding the file, recursively call untill the all the files are added */

  readFiles(changeEvent: any, reader: FileReader, index: number) {
    if (changeEvent.target.files.length > index) {
      // removes the first file from the queue
      let fileToAdd = changeEvent.target.files[index];
      let fileId = this.idService.generateIDUsingTime();
      let fileSize = changeEvent.target.files[index].size;

      // adding total size
      this.previewImageTotalSize += fileSize;
      let filename = this.formatFilename(changeEvent.target.files[index].name);

      if (this.myFiles.length < this.maxImageFileCount) {
        this.myFiles.push({
          id: fileId,
          file: fileToAdd,
        });
      }

      reader.onloadend = (loadEvent: any) => {
        if (this.previewImages.length < this.maxImageFileCount) {
          this.previewImages.push({
            id: fileId,
            file: loadEvent.target.result,
            filename: filename,
            size: fileSize,
          });
          console.log("Blob read : Complete");
          index++;
          this.readFiles(changeEvent, reader, index);
        }
      };

      reader.readAsDataURL(fileToAdd);
    } else {
      console.log("File Upload Complete");
      return;
    }
  }

  // Read thumbnail
  readThumbnailImage(changeEvent: any, reader: FileReader) {
    let fileToAdd = changeEvent.target.files[0];
    let fileId = this.idService.generateIDUsingTime();
    let fileSize = changeEvent.target.files[0].size;
    this.thumbnailPreviewTotalSize += fileSize;
    let filename = this.formatFilename(changeEvent.target.files[0].name);

    this.thumbnail = {
      id: fileId,
      file: fileToAdd,
    };

    reader.onloadend = (loadEvent: any) => {
      this.thumbnailPreview = {
        id: fileId,
        file: loadEvent.target.result,
        filename: filename,
        size: fileSize,
      };
    };
    reader.readAsDataURL(fileToAdd);
  }

  // call respective function based on type
  onFileChange(event: any, functionType: string) {
    let reader = new FileReader();

    switch (functionType) {
      case "images":
        this.readFiles(event, reader, 0);
        break;
      case "thumbnail":
        this.readThumbnailImage(event, reader);
        break;
      default:
        break;
    }
  }

  removeFromPreview(id: number) {
    this.myFiles = this.myFiles.filter((file) => file.id !== id);
    this.previewImages = this.previewImages.filter((file) => {
      if (file.id === id) {
        this.previewImageTotalSize -= file.size;
        return false;
      }
      return true;
    });
  }

  removeThumbnailPreview() {
    this.thumbnail = undefined;
    this.thumbnailPreview = undefined;
    this.thumbnailPreviewTotalSize = 0;
  }

  // **************************************************** Image Field content END ************************************************

  // **************************************************** Category Field content START ************************************************

  findCategory(name: string) {
    return this.category.find((item) => item.name);
  }

  selectCategory(categoryName: Category) {
    this.myForm.get("category").markAsTouched();
    if (this.myForm.get("category").value !== categoryName.name) {
      this.currentCategory = categoryName;
      this.myForm.patchValue({
        category: categoryName.name,
        subCategory: "",
      });
      this.subCategory = this.currentCategory.subCategory;
    }
  }

  selectSubCategory(subCategoryName: String) {
    this.myForm.get("subCategory").markAsTouched();
    if (this.myForm.get("subCategory").value !== subCategoryName) {
      this.currentSubCategory = subCategoryName;
      this.myForm.patchValue({
        subCategory: subCategoryName,
      });
    }
  }

  resetCategoryValues() {
    this.myForm.patchValue({ category: "", subCategory: "" });
    this.currentCategory = undefined;
    this.currentSubCategory = undefined;
    this.subCategory = [];
    this.myForm.get("category").markAsUntouched();
    this.myForm.get("subCategory").markAsUntouched();
  }

  // **************************************************** Category Field content END ************************************************

  // **************************************************** Tag content START ************************************************

  addTag(tag: string) {
    if (tag !== "" && this.tags.size < 5) {
      this.tags.add(tag);
    }
  }

  removeTag(tag: string) {
    if (tag !== "") this.tags.delete(tag);
  }

  // **************************************************** Tag content END ************************************************

  deleteProduct(productId: string) {
    this.productService
      .deleteProduct(productId)
      .subscribe((response: NetworkResponse) => {
        if (response.status === "ERR") {
          console.log("Error");
          this.showNotification(
            "top",
            "right",
            "Error In Deleting product",
            "danger"
          );
        } else {
          this.products = this.products.filter(
            (product) => product._id !== productId
          );
          this.showNotification(
            "top",
            "right",
            "Product Successfully Deleted",
            "success"
          );
        }
      });
  }

  resetForm() {
    this.myForm.reset();
    this.myFiles = [];
    this.tags = new Set();
    this.thumbnail = "";
    this.currentCategory = undefined;
    this.subCategory = undefined;
    this.currentSubCategory = undefined;
    this.previewImageTotalSize = 0;
    this.previewImages = [];
    this.thumbnailPreviewTotalSize = 0;
    this.removeThumbnailPreview();
  }

  submit() {
    const formData = new FormData();
    const formValues = this.myForm.value;
    console.log("Submitted data");
    console.log(this.myFiles);
    console.log(this.thumbnail);

    // console.log(this.myForm);

    formData.append("name", formValues.name);
    formData.append("description", formValues.description);
    formData.append("price", formValues.price);
    formData.append("stocks", formValues.stocks);
    formData.append("category", formValues.category);
    formData.append("subCategory", formValues.subCategory);

    this.myFiles.forEach((image: any) => {
      formData.append("images", image.file);
    });

    // console.log(this.thumbnail.file);

    formData.append("thumbnail", this.thumbnail.file);

    [...this.tags].forEach((tag) => {
      formData.append("tags", tag);
    });

    // console.log(formData.forEach((item) => console.log(item)));
    if (this.editMode) {
      this.productService
        .updateProduct(this.editProductId, formData)
        .subscribe((response) => {
          this.productService
            .getProducts()
            .subscribe((response: NetworkResponse) => {
              this.editMode = false;
              this.editProductId = "";
              this.products = response.payload;
              this.resetForm();
              this.tab = "viewall";
              this.showNotification(
                "top",
                "right",
                "Product Successfully Edited",
                "success"
              );
            });
        });
    } else {
      this.productService.addProduct(formData).subscribe((response) => {
        console.log(response);
        this.productService
          .getProducts()
          .subscribe((response: NetworkResponse) => {
            this.products = response.payload;
            this.resetForm();
            this.showNotification(
              "top",
              "right",
              "Product Successfully Saved",
              "success"
            );
          });
      });
    }

    // for (var i = 0; i < this.myFiles.len)gth; i++) {
    //   formData.append("file[]", this.myFiles[i]);
    // }

    // this.productService.testFileSend(formData).subscribe((response) => {
    //   console.log(response);
    //   console.log("upload successful");
    // });
  }
}
