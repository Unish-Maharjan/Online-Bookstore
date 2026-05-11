import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Books from './pages/Books.jsx';
import Cart from './pages/Cart.jsx';

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
      element: <><Cart/></>
    },

  ]);
  return <RouterProvider router={router}/>
}

export default App
