import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { RootLayout } from "./components/layout/RootLayout";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminDashboard } from "./admin/AdminDashboard";
import { AdminSettings } from "./admin/pages/AdminSettings";
import { AdminInteractions } from "./admin/pages/AdminInteractions";
import { AdminProducts } from "./admin/pages/AdminProducts";
import { AdminCategories } from "./admin/pages/AdminCategories";
import { AdminBrands } from "./admin/pages/AdminBrands";
import { AdminGallery } from "./admin/pages/AdminGallery";
import { AdminVideos } from "./admin/pages/AdminVideos";
import { AdminTestimonials } from "./admin/pages/AdminTestimonials";
import { AdminServices } from "./admin/pages/AdminServices";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "kategori", Component: CategoryPage },
      { path: "produk/:id", Component: ProductDetailPage },
      { path: "about", Component: AboutPage },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "products", Component: AdminProducts },
      { path: "categories", Component: AdminCategories },
      { path: "brands", Component: AdminBrands },
      { path: "gallery", Component: AdminGallery },
      { path: "videos", Component: AdminVideos },
      { path: "services", Component: AdminServices },
      { path: "testimonials", Component: AdminTestimonials },
      { path: "faq", Component: AdminInteractions },
      { path: "settings", Component: AdminSettings },
    ],
  },
]);
