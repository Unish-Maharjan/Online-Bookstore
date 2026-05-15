import React from 'react'
import { Link, useNavigate } from 'react-router'
import CartSummary from '../components/CartSummary'
import { useCart } from '../components/CartContext'
import CartItem from '../components/CartItem'

const Cart = () => {
  const navigate = useNavigate()
  const { state } = useCart()
  const { cartItems } = state

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[90vh] flex flex-col justify-center items-center gap-5 pb-30 bg-[#f3f4f8]">
        <i className="fa-solid fa-bag-shopping text-8xl text-indigo-200" />
        <p className="text-4xl font-bold text-[#0f172a]">Your cart is empty</p>
        <p className="text-lg text-gray-400">Looks like you haven't added any books yet.</p>
        <Link to="/books">
          <button className="mt-2 px-8 py-3 text-base bg-[#4f46e5] text-white rounded-xl font-semibold hover:bg-[#4338ca] hover:scale-105 transition-all duration-300 shadow-md hover:shadow-indigo-300 hover:shadow-lg">
            Browse Books
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f4f8]">
    
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-400">
        <Link to="/home">
        <button
          className="hover:text-indigo-600 transition-colors cursor-pointer"
        >  
          Home
        </button>
        </Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-500 font-medium">Cart</span>
      </div>

     
      <div className="max-w-6xl mx-auto px-6 pt-4 pb-6">
        <h1 className="text-4xl font-bold text-[#0f172a]">
          Shopping Cart{' '}
          <span className="text-[#0f172a]">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
        </h1>
      </div>

      
      <div className="max-w-6xl mx-auto px-6 pb-16 flex flex-col lg:flex-row gap-6 items-start">
     
        <div className="flex-1 flex flex-col gap-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

  
        <div className="w-full lg:w-90 shrink-0">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}

export default Cart