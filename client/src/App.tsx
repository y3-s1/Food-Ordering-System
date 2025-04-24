import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { OrderFormPage } from './pages/order/OrderFormPage';
import { OrderTrackingPage } from './pages/order/OrderTrackingPage';
import CartPage from './pages/cart/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/order/new" element={<OrderFormPage />} />
        <Route path="/order/:orderId/tracking" element={<OrderTrackingPage />} />
        {/*
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/order/confirm/:orderId" element={<OrderConfirmationPage />} />
        <Route path="/order/:orderId" element={<OrderDetailPage />} />
        */}
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
