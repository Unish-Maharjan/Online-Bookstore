import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination'

import { EffectCoverflow, Pagination } from 'swiper/modules';

const Latestarrival = () => {
  return (
    <>
  <div className='flex justify-between'>
    <div className='flex gap-3 px-8 mt-10 items-center'>
      <div className='h-12 w-10 flex items-center justify-center rounded-[15px] bg-green-200 text-green-600'>
        <i class="fa-solid fa-wand-magic-sparkles"></i>
      </div>

      <div className='flex flex-col'>
        <div className='text-3xl font-[Poppins] font-bold'>
          Latest Arrival
        </div>

        <div className='font-[Poppins] font-light'>
          Newest additions to our collection
        </div>
      </div>
    </div>

    <div className='flex items-center justify-center px-10 font-medium'>
      <button className='hover:bg-gray-950/10 p-2 px-3 hover:cursor-pointer rounded-[5px]'>
        View all <i className="fa-solid fa-angle-right"></i>
      </button>
    </div>
  </div>

  <div className='px-8 mt-10'>
    <Swiper
      effect={'coverflow'}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={3}
      spaceBetween={40}
      coverflowEffect={{
        rotate: 20,
        stretch: 0,
        depth: 120,
        modifier: 2,
        slideShadows: false,
      }}
      pagination={true}
      modules={[EffectCoverflow, Pagination]}
      className="mySwiper"
    >
      <SwiperSlide>
              <article className='rounded-[10px] shadow-xl overflow-hidden bg-white group'>
                
                <div className='h-105 overflow-hidden'>
                  <img
                    src='https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop'
                    className='w-full h-full object-cover object-center transition duration-500 group-hover:scale-110'
                    alt=''
                  />
                </div>
      
                <div className='p-4'>
                  <div className='list-none'>
                    <li className='text-[20px] font-semibold group-hover:text-blue-500'>
                      The Hobbit
                    </li>
      
                    <li className='text-gray-600 mt-1 text-[14px]'>
                      J.R.R Tolkien
                    </li>
      
                    <li className='py-1 font-medium'>
                      <i className="fa-solid fa-star text-yellow-300 mr-2"></i>
                      4.9
                    </li>
      
                    <li className='text-gray-500 text-[14px]'>
                      Fantasy
                    </li>
                  </div>
      
                  <hr className='my-4 text-gray-300'/>
      
                  <div className='flex justify-between items-center'>
                    <div className='list-none'>
                      <li className='text-[28px] font-bold'>$24.99</li>
                      <li className='text-gray-400'>28 in stock</li>
                    </div>
      
                    <button className='bg-[#1976d2] text-white p-2 rounded-[5px] px-3 hover:cursor-pointer group-hover:bg-[#1664b2]'>
                      <i className="fa-solid fa-cart-arrow-down mr-1"></i>
                      ADD
                    </button>
                  </div>
                </div>
              </article>
            </SwiperSlide>
      <SwiperSlide>
              <article className='rounded-[10px] shadow-xl overflow-hidden bg-white group'>
                
                <div className='h-105 overflow-hidden'>
                  <img
                    src='https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop'
                    className='w-full h-full object-cover object-center transition duration-500 group-hover:scale-110'
                    alt=''
                  />
                </div>
      
                <div className='p-4'>
                  <div className='list-none'>
                    <li className='text-[20px] font-semibold group-hover:text-blue-500'>
                      The Hobbit
                    </li>
      
                    <li className='text-gray-600 mt-1 text-[14px]'>
                      J.R.R Tolkien
                    </li>
      
                    <li className='py-1 font-medium'>
                      <i className="fa-solid fa-star text-yellow-300 mr-2"></i>
                      4.9
                    </li>
      
                    <li className='text-gray-500 text-[14px]'>
                      Fantasy
                    </li>
                  </div>
      
                  <hr className='my-4 text-gray-300'/>
      
                  <div className='flex justify-between items-center'>
                    <div className='list-none'>
                      <li className='text-[28px] font-bold'>$24.99</li>
                      <li className='text-gray-400'>28 in stock</li>
                    </div>
      
                    <button className='bg-[#1976d2] text-white p-2 rounded-[5px] px-3 hover:cursor-pointer group-hover:bg-[#1664b2]'>
                      <i className="fa-solid fa-cart-arrow-down mr-1"></i>
                      ADD
                    </button>
                  </div>
                </div>
              </article>
            </SwiperSlide>
      <SwiperSlide>
              <article className='rounded-[10px] shadow-xl overflow-hidden bg-white group'>
                
                <div className='h-105 overflow-hidden'>
                  <img
                    src='https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop'
                    className='w-full h-full object-cover object-center transition duration-500 group-hover:scale-110'
                    alt=''
                  />
                </div>
      
                <div className='p-4'>
                  <div className='list-none'>
                    <li className='text-[20px] font-semibold group-hover:text-blue-500'>
                      The Hobbit
                    </li>
      
                    <li className='text-gray-600 mt-1 text-[14px]'>
                      J.R.R Tolkien
                    </li>
      
                    <li className='py-1 font-medium'>
                      <i className="fa-solid fa-star text-yellow-300 mr-2"></i>
                      4.9
                    </li>
      
                    <li className='text-gray-500 text-[14px]'>
                      Fantasy
                    </li>
                  </div>
      
                  <hr className='my-4 text-gray-300'/>
      
                  <div className='flex justify-between items-center'>
                    <div className='list-none'>
                      <li className='text-[28px] font-bold'>$24.99</li>
                      <li className='text-gray-400'>28 in stock</li>
                    </div>
      
                    <button className='bg-[#1976d2] text-white p-2 rounded-[5px] px-3 hover:cursor-pointer group-hover:bg-[#1664b2]'>
                      <i className="fa-solid fa-cart-arrow-down mr-1"></i>
                      ADD
                    </button>
                  </div>
                </div>
              </article>
            </SwiperSlide>
    </Swiper>
  </div>
    </>
  )
}

export default Latestarrival
