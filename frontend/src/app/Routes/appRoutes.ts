import { RoutingConstants } from "src/app/Constants/RoutingConstants";
import { Auth } from "src/pages/Auth/Auth";
import { Cart } from "src/pages/Cart/Cart";
import { Admin } from "src/pages/Admin/Admin";
import { TagAdd } from "src/pages/TagAdd/TagAdd";
import { Composition } from "src/pages/Composition/Composition";
import { ProductAdd } from "src/pages/ProductAdd/ProductAdd";
import { CompositionAdd } from "src/pages/CompositionAdd/CompositionAdd";

export const appRoutes = [
  {
    path: RoutingConstants.COMPOSITION,
    Element: Composition,
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
  },
  {
    path: RoutingConstants.ADD_TAGS,
    Element: TagAdd,
  },
  {
    path: RoutingConstants.ADD_PRODUCT,
    Element: ProductAdd,
  },
  {
    path: RoutingConstants.ADD_COMPOSITION,
    Element: CompositionAdd,
  },
];
