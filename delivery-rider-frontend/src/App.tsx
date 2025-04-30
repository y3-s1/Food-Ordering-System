import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DeliveryDetails from './pages/DeliveryDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard" element={
        localStorage.getItem('rider') ? <Dashboard /> : <Navigate to="/login" />
      } />
      <Route path="/delivery/:id" element={<DeliveryDetails />} />
    </Routes>
  );
}

export default App;
