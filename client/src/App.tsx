
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
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
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import StripeProvider from './stripe/StripeProvider';
import CheckoutPage from './pages/payment/CheckoutPage';
import RestaurantList from './components/restaurant/RestaurantList';
import RestaurantUserDetailPage from './components/restaurant/RestaurantUserDetailPage';
import CartDrawer from './components/cart/CartDrawer';
import { useCart } from './context/cartContext';

function AppContent() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const location = useLocation();
  const { cartOpen, setCartOpen } = useCart();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col h-screen">
      {/* Show Navbar only if NOT admin */}
      {!isAdminRoute && <Navbar />}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto hide-scrollbar">
        <Routes>
          {/* Normal User Routes */}
          <Route path="/order/new" element={<OrderFormPage />} />
          <Route path="/order/:orderId/tracking" element={<OrderTrackingPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/order/confirm/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/order/:orderId/edit" element={<OrderModificationPage />} />
          <Route path="/order/:orderId" element={<OrderDetailPage />} />
          <Route
            path="/cart"
            element={isDesktop ? <Navigate to="/" replace /> : <CartPage />}
          />
          <Route path="/customer-dashboard" element={<RestaurantList/>}/>
          <Route path="/Restaurants/:id" element={<RestaurantUserDetailPage/>}/>

          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* Admin Panel Route */}
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

          {/* Payment Page */}
          <Route path="/checkout" element={<StripeProvider><CheckoutPage /></StripeProvider>} />
        </Routes>

        {/* Show Footer only if NOT admin */}
        {!isAdminRoute && <Footer />}
      </main>
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
