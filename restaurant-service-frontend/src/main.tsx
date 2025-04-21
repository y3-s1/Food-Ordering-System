import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './layout/RootLayout.tsx';
import Home from './pages/Home.tsx';
import RestaurantListPage from './pages/RestaurantList.tsx';
import AddRestaurantPage from './pages/AddRestaurantPage.tsx';
import RestaurantDetailPage from './pages/RestaurantDetailPage.tsx';


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
        element: <RestaurantListPage />,
      },
      {
        path: '/add-restaurant',
        element: <AddRestaurantPage />,
      },
      {
        path: '/Restaurants/:restaurantId',
        element: <RestaurantDetailPage />,
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
