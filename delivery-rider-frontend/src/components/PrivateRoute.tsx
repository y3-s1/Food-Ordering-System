import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const rider = localStorage.getItem('rider');
  return rider ? children : <Navigate to="/" />;
};

export default PrivateRoute;
