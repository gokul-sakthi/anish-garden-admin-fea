import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TableComponent } from "../../pages/table/table.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UpgradeComponent } from "../../pages/upgrade/upgrade.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularFileUploaderModule } from "angular-file-uploader";

import { CollectionsComponent } from "app/pages/collections/collections.component";
import { ProductsComponent } from "app/pages/products/products.component";
import { CategoriesComponent } from "app/pages/categories/categories.component";
import { AccordionComponent } from "app/components/accordion/accordion.component";
import { DiscountComponent } from "app/pages/discount/discount.component";
import { OthersComponent } from "app/pages/others/others.component";
import { OrdersComponent } from "app/pages/orders/orders.component";
import { SpinnerComponent } from "app/components/spinner/spinner.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    AngularFileUploaderModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    CollectionsComponent,
    ProductsComponent,
    CategoriesComponent,
    AccordionComponent,
    DiscountComponent,
    OthersComponent,
    OrdersComponent,
    SpinnerComponent,
  ],
})
export class AdminLayoutModule {}
