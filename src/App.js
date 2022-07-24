import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Contact,
  Login,
  Signup,
  Reset,
  Admin,
  Saved,
  Notifications,
  Cart,
  CheckoutDetails,
  Checkout,
  CheckoutSuccess,
  OrderHistory,
  OrderDetails,
  Error404,
} from "./pages";
import { Header, Footer, ProductDetails, ReviewProducts } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import AdminOnlyRoute from "./components/adminOnlyRoute/AdminOnlyRoute";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <>
      <BrowserRouter>
      <ScrollToTop />
        <ToastContainer
          toastStyle={{
            backgroundColor: "#c07d53",
            color: "#fff",
            fontSize: "1.6rem",
          }}
        />
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<Reset />} />
          <Route
            path="/admin/*"
            element={
              <AdminOnlyRoute>
                <Admin />
              </AdminOnlyRoute>
            }
          />
          <Route path="/product-details/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/saved-products" element={<Saved />} />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout-details"
            element={
              <ProtectedRoute>
                <CheckoutDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout-success"
            element={
              <ProtectedRoute>
                <CheckoutSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-details/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review-product/:id"
            element={
              <ProtectedRoute>
                <ReviewProducts />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Error404 />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
