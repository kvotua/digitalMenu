import { lazy } from "react";

export const publicRoutes = [
  {
    path: "/",
    Element: lazy(() => import("../../pages/Home")),
  },
  {
    path: "/auth",
    Element: lazy(() => import("../../pages/Auth")),

  },
  {
    path: "/composition/id",
    Element: lazy(() => import("../../pages/Composition")),

  },
  {
    path: "/tag/id",
    Element: lazy(() => import("../../pages/Tag")),

  },
];

export const authRoutes = [
  {
    path: "/add/composition",
    Element: lazy(() => import("../../pages/AddComposition")),

  },
  {
    path: "/add/product",
    Element: lazy(() => import("../../pages/AddProduct")),

  },
  {
    path: "/add/tag",
    Element: lazy(() => import("../../pages/AddTag")),
    
  },
  {
    path: "/analytics",
    Element: lazy(() => import("../../pages/Analytics")),
   
  },

];
export const RootRoutes =[
{
    path: "/settings",
    Element: lazy(() => import("../../pages/Settings")),
}
];