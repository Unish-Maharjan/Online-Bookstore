import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router'

const Cart = () => {
  return (
    <>
    <Header/>
      <div className='container flex flex-col justify-center items-center h-[90vh] gap-4 pb-30'>
            <i class="fa-solid fa-bag-shopping text-8xl"></i>
            <p className='text-4xl'>Your cart in empty</p>
            <p className='text-xl text-gray-500'>Looks like you haven't added any books yet.</p>
             <Link to='/books'><button className='p-2 w-70 text-[20px] bg-[#4f46e5] shadow-md text-white 
             hover:scale-105 ease-out duration-500 hover:cursor-pointer hover:shadow-blue-400 hover:shadow-lg
              rounded-[10px] font-semibold'>Browse Books</button></Link>
      </div>
    <Footer/>
    </>
  )
}

export default Cart
