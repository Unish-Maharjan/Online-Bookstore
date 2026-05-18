import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router';
import { useCart } from '../components/CartContext' 
import toast from 'react-hot-toast'
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { useGetBooksQuery } from '../services/bookApi';

const Bestseller = () => {

  const { addToCart } = useCart();

  const handleAddToCart = async (item) => {
    await addToCart(item);
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

  const { data } = useGetBooksQuery();

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
      pagination={{ clickable: true }}
      modules={[Pagination]}
      className="mySwiper h-150"
      >

        {data?.filter((book) => book.rating >= 4.8).map((book) => (
          <SwiperSlide key={book._id}>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group h-130 w-80 ml-2
              transition-all duration-300 hover:scale-105 hover:shadow-2xl">

              <div className="overflow-hidden rounded-t-2xl h-[70%]">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              <div className="p-3 px-5">

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[16px] font-medium text-indigo-500 bg-indigo-50 px-3 py-0.5 rounded-full">
                    {book.category}
                  </span>
                  <span className="flex items-center gap-1 text-[15px] font-medium text-gray-700">
                    <span className="text-amber-400">★</span>{book.rating}
                  </span>
                </div>

                <p className="text-[22px] font-bold text-gray-900 leading-snug h-8 overflow-hidden">
                  {book.title}
                </p>

                <p className="text-[14px] text-gray-400 mt-0.5 mb-1">
                  {book.author}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-indigo-500">
                    ${book.price}
                  </div>
                  <button
                    className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600
                      active:scale-95 text-white text-sm font-semibold px-4 py-2
                      rounded-full transition-all duration-150"
                    onClick={() => handleAddToCart(book)}
                  >
                    <i className="fa-solid fa-cart-arrow-down"></i>
                    Add
                  </button>
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
  
  </div>
  </div>
    </>
  )
}

export default Bestseller