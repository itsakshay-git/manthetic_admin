import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminLayout from "@/layout/AdminLayout";
import Loader from "@/components/shared/Loader";
import { Toaster } from "sonner";
import AddVariantPage from "./components/product/AddVariantPage";


const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const ProductsPage = lazy(() => import("@/pages/dashboard/ProductsPage"));
const OrdersPage = lazy(() => import("@/pages/dashboard/OrdersPage"));
const CustomersPage = lazy(() => import("@/pages/dashboard/CustomersPage"));
const ReviewsPage = lazy(() => import("@/pages/dashboard/ReviewsPage"));

const LoginPage = lazy(() => import("@/pages/login/LoginPage"));
const NotFoundPage = lazy(() => import("@/pages/errors/NotFoundPage"));
const AddProductPage = lazy(() => import("@/pages/dashboard/AddProduct"));

function App() {
  return (
    <BrowserRouter>
    <Toaster richColors position="top-right" />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="add-product" element={<AddProductPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="/add-variant/:productId" element={<AddVariantPage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
