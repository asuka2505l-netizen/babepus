import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AdminPage from "../pages/AdminPage";
import DashboardOffersPage from "../pages/DashboardOffersPage";
import DashboardOverviewPage from "../pages/DashboardOverviewPage";
import DashboardProductsPage from "../pages/DashboardProductsPage";
import DashboardProfilePage from "../pages/DashboardProfilePage";
import DashboardTransactionsPage from "../pages/DashboardTransactionsPage";
import DashboardWishlistPage from "../pages/DashboardWishlistPage";
import DashboardChatPage from "../pages/DashboardChatPage";
import SellerAnalyticsPage from "../pages/SellerAnalyticsPage";
import LoginPage from "../pages/LoginPage";
import MarketplacePage from "../pages/MarketplacePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import RegisterPage from "../pages/RegisterPage";

const AppRouter = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<Navigate to="/marketplace" replace />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
    </Route>

    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardOverviewPage />} />
      <Route path="products" element={<DashboardProductsPage />} />
      <Route path="offers" element={<DashboardOffersPage />} />
      <Route path="transactions" element={<DashboardTransactionsPage />} />
      <Route path="profile" element={<DashboardProfilePage />} />
      <Route path="wishlist" element={<DashboardWishlistPage />} />
      <Route path="chat" element={<DashboardChatPage />} />
      <Route path="analytics" element={<SellerAnalyticsPage />} />
    </Route>

    <Route
      path="/admin"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AdminPage />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;
