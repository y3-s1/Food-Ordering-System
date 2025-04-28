import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { OrderFormPage } from './pages/order/OrderFormPage';
import { OrderTrackingPage } from './pages/order/OrderTrackingPage';
import CartPage from './pages/cart/CartPage';
import OrderHistoryPage from './pages/order/OrderHistoryPage';
import { OrderDetailPage } from './pages/order/OrderDetailPage';
import { OrderConfirmationPage } from './pages/order/OrderConfirmationPage';
import OrderModificationPage from './pages/order/OrderModificationPage';
import Navbar from './components/common/NavBar';
import Footer from './components/common/Footer';
import { useMediaQuery } from './hooks/useMediaQuery';
import FoodItemModel from './components/cart/FoodItemModel';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import StripeProvider from './stripe/StripeProvider';
import CheckoutPage from './pages/payment/CheckoutPage';
import RestaurantOrderList from './pages/restuarant/RestaurantOrderList';

function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        {/* Sticky navbar at top */}
        <Navbar />

        {/* Routes container scrolls within remaining viewport */}
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          <Routes>
            <Route path="/order/new" element={<OrderFormPage />} />
            <Route path="/order/:orderId/tracking" element={<OrderTrackingPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/order/confirm/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/order/:orderId/edit" element={<OrderModificationPage />} />
            <Route path="/order/:orderId" element={<OrderDetailPage />} />
            <Route path="/restaurant/orders" element={<RestaurantOrderList />} />
            <Route
          path="/cart"
          element={isDesktop ? <Navigate to="/" replace /> : <CartPage />}
        />
            
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/checkout" element={<StripeProvider><CheckoutPage /></StripeProvider>}/>
          </Routes>
        <Footer/>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
