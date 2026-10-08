import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Books from './pages/Books.jsx';
import Cart from './pages/Cart.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { Toaster, useToasterStore, toast } from 'react-hot-toast';
import User from './pages/User.jsx';
import Singleproduct from './components/Singleproduct.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import ManageBooks from './components/Managebook.jsx';
import Addbooks from './components/Addbooks.jsx';
import Dashboard from './components/Dashboard.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import EsewaSuccess from './pages/EsewaSuccess.jsx';

function ToastLimitManager({ limit = 2 }) {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= limit)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts, limit]);

  return null;
}

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
      path: '/checkout',
      element: <><Header/><Checkout/><Footer/></>
    },
    {
      path: '/payment/esewa/success',
      element: <><Header/><EsewaSuccess/><Footer/></>
    },
    {
      path: '/esewa-success',
      element: <><Header/><EsewaSuccess/><Footer/></>
    },
    {
      path: '/orders',
      element: <><Header/><Orders/><Footer/></>
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
      path: '/dashboard',
      element:
      <>
      <Header/>
      <Dashboard/>
      <Footer/>
      </>

    },
    {
      path: '/managebooks',
      element:
      <AdminRoute>
      <Header/>
      <ManageBooks/>
      <Footer/>
      </AdminRoute>
    },
    {
      path: '/addbooks',
      element:
      <AdminRoute>
      <Header/>
      <Addbooks/>
      <Footer/>
      </AdminRoute>
    },

  ]);
  return (
    <>
      <ToastLimitManager limit={2} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App
