import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './layout/RootLayout.tsx';
import Home from './pages/Home.tsx';
import Restaurants from './pages/RestaurantList.tsx';
import AddRestaurant from './pages/AddRestaurant.tsx';


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/Restaurants',
        element: <Restaurants />,
      },
      {
        path: '/add-restaurant',
        element: <AddRestaurant />,
      },
      // {
      //   path: '/about',
      //   element: <About />,
      // },
      // Add more routes as needed
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
