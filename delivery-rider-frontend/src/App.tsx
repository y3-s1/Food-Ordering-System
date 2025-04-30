import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DeliveryDetails from './pages/DeliveryDetails';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/delivery/:id" 
        element={
          <PrivateRoute>
            <DeliveryDetails />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;
