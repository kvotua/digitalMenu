import { Collection } from "src/pages/Collection/Collection";
import { RoutingConstants } from "src/app/Constants/RoutingConstants";
import { Auth } from "src/pages/Auth/Auth";
import { Cart } from "src/pages/Cart/Cart";
import { Admin } from "src/pages/Admin/Admin";

export const appRoutes = [
  {
    path: RoutingConstants.COLLECTION,
    Element: Collection,
  },
  {
    path: RoutingConstants.AUTH,
    Element: Auth,
  },
  {
    path: RoutingConstants.CART,
    Element: Cart,
  },
];

export const authRoutes = [
  {
    path: RoutingConstants.ADMIN,
    Element: Admin,
  }
]