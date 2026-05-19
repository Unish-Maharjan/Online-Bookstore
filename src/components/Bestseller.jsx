import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../components/CartContext'
import toast from 'react-hot-toast'
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { useGetBooksQuery } from '../services/bookApi';

const Bestseller = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { data } = useGetBooksQuery();

  const handleAddToCart = async (item) => {
    await addToCart(item);
    toast.success(`${item.title} added to cart!`, {
      duration: 3000,
      style: { padding: '14px', color: '#12923d', background: '#ecfdf3' },
      iconTheme: { primary: '#12923d' },
    });
  };

  const bestsellers = data?.filter((book) => book.rating >= 4.8);

  return (
    <div className='bg-white py-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-8'>

        <div className='flex justify-between items-center mb-8'>
          <div className='flex gap-3 items-center'>
            <div className='h-10 w-10 sm:h-12 sm:w-10 flex items-center justify-center rounded-[15px] bg-amber-300 text-orange-600 shrink-0'>
              <i className="fa-solid fa-arrow-trend-up"></i>
            </div>
            <div className='flex flex-col'>
              <div className='text-2xl sm:text-3xl font-[Poppins] font-bold'>Best Seller</div>
              <div className='font-[Poppins] font-light text-sm sm:text-base text-gray-500'>Most popular books this month</div>
            </div>
          </div>
          <Link to='/books' className='hover:text-[#5951e6] font-medium text-[15px] sm:text-[18px] px-3 py-2 rounded-[5px] shrink-0'>
            View all <i className="fa-solid fa-angle-right"></i>
          </Link>
        </div>

        <Swiper
          breakpoints={{
            0:   { slidesPerView: 1, spaceBetween: 14 },
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 18 },
            1024:{ slidesPerView: 4, spaceBetween: 18 },
          }}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mySwiper pb-10"
        >
          {bestsellers?.map((book) => (
            <SwiperSlide key={book._id}>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group
                transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-[460px]">

                <div className="overflow-hidden rounded-t-2xl h-[60%] shrink-0"
                  onClick={() => navigate(`/books/${book._id}`)}>
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[13px] font-medium text-indigo-500 bg-indigo-50 px-3 py-0.5 rounded-full truncate max-w-[70%]">
                      {book.category}
                    </span>
                    <span className="flex items-center gap-1 text-[13px] font-medium text-gray-700 shrink-0">
                      <span className="text-amber-400">★</span>{book.rating}
                    </span>
                  </div>

                  <p className="text-[18px] font-bold text-gray-900 leading-snug line-clamp-1"
                    onClick={() => navigate(`/books/${book._id}`)}>
                    {book.title}
                  </p>

                  <p className="text-[13px] text-gray-400 mt-0.5 mb-3">
                    {book.author}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-xl font-bold text-indigo-500">
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
  );
}

export default Bestseller;