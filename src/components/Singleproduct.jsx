import React from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from '../components/CartContext'
import toast from 'react-hot-toast'
import { Star, ShoppingCart, Package } from "lucide-react";
import { useGetSingleBookQuery } from '../services/bookApi'; 

const Singleproduct = () => {
  const { addToCart } = useCart();
  const params = useParams();

  const { data: singleData, isLoading, isError } = useGetSingleBookQuery(params.id);

  const handleAddToCart = async (item) => {
    await addToCart(item);
    toast.success(`${item.title} added to cart!`, {
      duration: 3500,
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

  if (isLoading) return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <p className="text-xl text-gray-500 font-[Poppins]">Loading...</p>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <p className="text-xl text-red-500 font-[Poppins]">Something went wrong!</p>
    </div>
  );

  return (
    <>
      <Link to='/books'>
        <div className="ml-20 mt-5 text-gray-500 font-[Poppins] bg-[#f5f5f7] font-semibold hover:text-blue-600">
          <i className="fa-solid fa-arrow-left-long"></i> back to books
        </div>
      </Link>
      <div className="bg-[#f5f5f7] min-h-screen flex items-center px-6 py-10 h-[80vh]">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ml-20">

          <div className="flex justify-center ml-15">
            <div className="overflow-hidden rounded-[20px] shadow-2xl">
              <img
                src={singleData?.image}
                alt="book"
                className="w-120 object-cover hover:scale-105 duration-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <span className="bg-purple-100 text-indigo-600 px-4 py-1 rounded-full text-[20px] font-semibold w-fit">
              {singleData?.category}
            </span>

            <div>
              <h1 className="text-5xl font-bold text-[#0f172a] leading-tight">
                {singleData?.title}
              </h1>
              <p className="text-xl text-gray-500 mt-4">
                by {singleData?.author}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center text-orange-400 gap-1">
                <Star fill="currentColor" size={24} />
                <Star fill="currentColor" size={24} />
                <Star fill="currentColor" size={24} />
                <Star fill="currentColor" size={24} />
                <Star size={24} />
              </div>
              <span className="text-xl text-gray-700">{singleData?.rating}</span>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2 text-gray-500 text-xl">
                <Package size={20} />
                <span>{singleData?.stock} in stock</span>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-indigo-600">
              ${singleData?.price}
            </h2>

            <div className="space-y-5">
              <h3 className="text-[18px] font-bold text-[#0f172a]">Description</h3>
              <p className="text-gray-500 text-[20px] leading-11.25 overflow-hidden">
                {singleData?.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white rounded-2xl px-9
                h-12 text-xl font-semibold flex items-center gap-4 shadow-lg"
                onClick={() => handleAddToCart(singleData)}>
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button className="bg-orange-400 hover:bg-orange-500 transition-all duration-300 text-white
                rounded-2xl px-10 h-12 text-xl font-semibold shadow-lg">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Singleproduct;