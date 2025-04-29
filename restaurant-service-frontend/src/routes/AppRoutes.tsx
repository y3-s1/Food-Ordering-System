import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AddRestaurant from '../pages/AddRestaurant';
import EditRestaurant from '../pages/EditRestaurant';
import ManageMenu from '../pages/ManageMenu';
import { useAuth } from '../auth/AuthContext';
import Navbar from '../components/shared/Navbar';

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const isRestaurantOwner = user?.role === 'restaurantOwner';

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={isRestaurantOwner ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/add-restaurant" element={isRestaurantOwner ? <AddRestaurant /> : <Navigate to="/" />} />
        <Route path="/edit-restaurant/:id" element={isRestaurantOwner ? <EditRestaurant /> : <Navigate to="/" />} />
        <Route path="/manage-menu/:id" element={isRestaurantOwner ? <ManageMenu /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
