import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useGetproductQuery } from '../services/productApi'



const Books = () => {
    const {data} = useGetproductQuery();
  return (
    <>
      <Header/>
      <div className='flex flex-col justify-center items-center gap-3 mr-10 bg-[#f8fafc] pb-20'>
            <div className='font-bold font-[Poppins] text-4xl px-8 pt-10'>
                All Books
            </div>
            <div className='flex'>
                <div className='px-8 mt-15 w-[25%] border border-gray-200 rounded-[20px] shadow-md mx-8 h-150'>
                    <div className='font-[Poppins] mt-6 font-semibold text-[23px]'>
                        <i class="fa-solid fa-sliders text-blue-500 mr-1"></i>
                        Filters
                    </div>
                    <form className='flex flex-col mt-4 gap-2'>
                        <label htmlFor='Search' className='text-[14px] font-[Poppins] '>Search</label>
                        <div className='flex gap-4 border border-gray-400 p-1 px-3 ml-2 rounded-[10px] py-1.5'>
                            <button><i class="fa-solid fa-magnifying-glass text-gray-500"></i></button>
                            <input type='text' placeholder='Search books' className='outline-none rounded-[5px] text-[16px] border-0'/>
                        </div>
                        <label htmlFor='Search' className='text-[14px] font-[Poppins] mt-4  '>Category</label>
                        <div className='flex gap-4 border border-gray-400 p-1 px-3 ml-2 rounded-[50px] py-2 mt-1'>
                            <select name='sort' id='sort' className='border-0 outline-0 w-full text-gray-500
                             px-2 hover:cursor-pointer font-[Poppins] text-[14px]'>
                                <option value="all">All Categories</option>
                                <option value="fiction">Fiction</option>
                                <option value="technology">Technology</option>
                                <option value="business">Business</option>
                                <option value="selfhelp">Self Help</option>
                                <option value="science">Science</option>
                                <option value="history">History</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div>
                    <div className='mb-8 mt-15 flex items-center justify-between'>
                    <div className='text-gray-500 font-[Poppins]'>
                        Showing books
                    </div>
                    <div>
                        <form className='flex flex-col gap-2'>
                        <div className='flex gap-4 border border-gray-600 p-1 px-3 ml-2 rounded-[5px] py-2 mt-1'>
                            <select name='sort' id='sort' className='border-0 outline-0 w-full text-gray-700
                             px-2 hover:cursor-pointer font-[Poppins] text-[14px]'>
                                <option value="all">All Categories</option>
                                <option value="fiction">Fiction</option>
                                <option value="technology">Technology</option>
                                <option value="business">Business</option>
                                <option value="selfhelp">Self Help</option>
                                <option value="science">Science</option>
                                <option value="history">History</option>
                            </select>
                        </div>
                    </form>
                    </div>
                    </div>
                    <div className='grid grid-cols-3 gap-10'>
                    {data?.products?.map((data)=>(                   
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group h-120 w-75
                    transition-all duration-300 hover:scale-105 hover:shadow-2xl">

                        <div className="overflow-hidden rounded-t-2xl h-[65%]">
                            <img
                            src={data?.images}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            />
                        </div>

                        <div className="p-3">

                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[12px] font-medium text-indigo-500 bg-indigo-50 px-3 py-0.5 rounded-full">
                            Fiction
                            </span>

                            <span className="flex items-center gap-1 text-[12px] font-medium text-gray-700">
                            <span className="text-amber-400">★</span>{data?.rating}
                            </span>
                        </div>

                        <p className="text-[20px] font-bold text-gray-900 leading-snug h-7 overflow-hidden">
                        {data?.title}
                        </p>

                        <p className="text-[14px] text-gray-400 mt-1 mb-3">
                            Matt Haig
                            </p>

                        <div className="flex items-center justify-between px-1">
                            <span className="text-[18px] font-bold text-indigo-500 mt-2">
                            ${data?.price}
                            </span>

                            <button className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 
                            active:scale-95 text-white text-sm font-semibold px-4 py-2 mt-2 rounded-full transition-all duration-150">
                            <i className="fa-solid fa-cart-arrow-down"></i>
                            Add
                            </button>
                    </div>

                 </div>

                    </div>                   
                    ))}
                    </div>
                </div>
            </div>
      </div>
      <Footer/>
    </>
  )
}

export default Books
