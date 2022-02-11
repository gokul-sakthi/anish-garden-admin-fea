import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TableComponent } from "../../pages/table/table.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UpgradeComponent } from "../../pages/upgrade/upgrade.component";
import { CollectionsComponent } from "app/pages/collections/collections.component";
import { ProductsComponent } from "app/pages/products/products.component";
import { CategoriesComponent } from "app/pages/categories/categories.component";
import { DiscountComponent } from "app/pages/discount/discount.component";
import { OthersComponent } from "app/pages/others/others.component";
import { OrdersComponent } from "app/pages/orders/orders.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "user", component: UserComponent },
  { path: "table", component: TableComponent },
  { path: "typography", component: TypographyComponent },
  { path: "icons", component: IconsComponent },
  { path: "maps", component: MapsComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "upgrade", component: UpgradeComponent },
  { path: "collections", component: CollectionsComponent },
  { path: "products", component: ProductsComponent },
  { path: "categories", component: CategoriesComponent },
  { path: "discounts", component: DiscountComponent },
  { path: "others", component: OthersComponent },
  { path: "orders", component: OrdersComponent },
];
