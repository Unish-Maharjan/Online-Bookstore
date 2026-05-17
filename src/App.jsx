import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Books from './pages/Books.jsx';
import Cart from './pages/Cart.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { Toaster } from 'react-hot-toast';
import User from './pages/User.jsx';
import Singleproduct from './components/Singleproduct.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import ManageBooks from './components/Managebook.jsx';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <><Home/></>
    },
    {
      path: '/home',
      element: <><Home/></>
    },
    {
      path: '/books',
      element: <><Books/></>
    },
    {
      path: '/cart',
      element: <><Header/><Cart/><Footer/></>
    },
    {
      path: '/user',
      element: <><Header/><User/><Footer/></>
    },
    {
      path: '/books/:id',
      element: <><Header/><Singleproduct/><Footer/></>
    },
    {
      path: '/admin-dashboard',
      element:
      <AdminRoute>
      <Header/>
      <AdminDashboard/>
      <Footer/>
      </AdminRoute>
    },
    {
      path: '/addbooks',
      element:
      <AdminRoute>
      <Header/>
      <ManageBooks/>
      <Footer/>
      </AdminRoute>
    },

  ]);
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App
