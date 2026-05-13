import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router';
import { useCart } from '../components/CartContext' 
import toast from 'react-hot-toast'

// Import Swiper React components
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const Bestseller = () => {
  const { dispatch } = useCart();
  
      const handleAddToCart = (item) => {
          dispatch({
              type: "ADD_TO_CART",
              payload: item,
              });
  
          toast.success(`${item.title} added to cart!`, {
              duration: 3000,
              style: {
                  padding: '14px',
                  color: '#12923d',
                  background: '#ecfdf3',
              },
              iconTheme: {
                  primary: '#12923d',
              },
              });
          };
  return (
    <>
    <div className='bg-white'>
    <div className='container'>
  <div className='flex justify-between mb-10 '>
    <div className='flex gap-3 px-8 mt-10 items-center'>
      <div className='h-12 w-10 flex items-center justify-center rounded-[15px] bg-amber-300 text-orange-600'>
        <i className="fa-solid fa-arrow-trend-up"></i>
      </div>

      <div className='flex flex-col'>
        <div className='text-3xl font-[Poppins] font-bold'>
          Best Seller
        </div>

        <div className='font-[Poppins] font-light'>
          Most popular books this month
        </div>
      </div>
    </div>

    <div className='flex items-center justify-center px-10 font-medium'>
      <Link to='/' className='hover:text-[#5951e6] p-2 px-3 hover:cursor-pointer text-[18px] rounded-[5px]'>
        View all <i className="fa-solid fa-angle-right"></i>
      </Link>
    </div>
  </div>

  
    <Swiper
        slidesPerView={4}
        spaceBetween={18}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper h-150"
      >
      <div className='px-8 gap-6 grid grid-cols-4'>
      <SwiperSlide>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group h-130 w-80 ml-2
      transition-all duration-300 hover:scale-105 hover:shadow-2xl">

      <div className="overflow-hidden rounded-t-2xl h-[70%] hover:rounded-t-2xl">
        <img
          src='https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
         className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
         />
      </div>

    <div className="p-3 px-5">

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[16px] font-medium text-indigo-500 bg-indigo-50 px-3 py-0.5 rounded-full">
          Fiction
        </span>

        <span className="flex items-center gap-1 text-[15px] font-medium text-gray-700">
          <span className="text-amber-400">★</span>4.5
        </span>
      </div>

        <p className="text-[22px] font-bold text-gray-900 leading-snug h-8 overflow-hidden">
          The Midnight Library
        </p>

       <p className="text-[14px] text-gray-400 mt-0.5 mb-1">
          Matt Haig
        </p>

      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-indigo-500">
          $69.99
        </div>

        <button className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600
         active:scale-95 text-white text-sm font-semibold px-4 py-2 
         rounded-full transition-all duration-150" onClick={() => handleAddToCart(product)}>
          <i className="fa-solid fa-cart-arrow-down"></i>
          Add
        </button>
      </div>

    </div>

        </div>
      </SwiperSlide>
  
      </div>
    </Swiper>
  
  </div>
  </div>
    </>
  )
}

export default Bestseller
