import { Collection } from "src/pages/Collection/Collection";
import { Home } from "src/pages/Home/Home";
import { RoutingConstants } from "src/app/Constants/RoutingConstants";
import { Auth } from "src/pages/Auth/Auth";

export const appRoutes = [
  {
    path: RoutingConstants.HOME,
    Element: Home,
  },
  {
    path: RoutingConstants.COLLECTION,
    Element: Collection,
  },
  {
    path: RoutingConstants.AUTH,
    Element: Auth,
  },
];
