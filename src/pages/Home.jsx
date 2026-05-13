import React from 'react'
import bg from '../assets/bg.png';
import books from '../assets/books.jpg'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Bestseller from '../components/Bestseller';
import { Link } from 'react-router';


const Home = () => {
  return (
    <>
    <Header/>
    <div className='pb-20'>
    <div className='container'>
    <div className='relative overflow-hidden flex px-8 gap-7 h-180  items-center pb-20'> 
      <div>
      <div className='flex flex-col gap-5'>
        <h1 className='text-7xl font-[Poppins] font-bold'>
          Discover Your Next Great Read
        </h1>

        <h3 className='text-xl font-[Poppins]  w-[90%] mt-1 text-gray-500'>
          Explore thousands of books across all genres. From bestsellers to hidden gems, find your perfect read today.
        </h3>
      </div>

      <div className='flex gap-6 mt-11'>
        <Link to='/books'><button className='p-2 w-70 text-[20px] bg-[#4f46e5] shadow-md text-white hover:scale-105
         ease-out duration-500 hover:cursor-pointer hover:shadow-blue-400 hover:shadow-lg 
         rounded-[10px] font-semibold'>Browse Books</button></Link>
        <button className='p-2 w-70 text-[20px] bg-white shadow-md hover:scale-105 ease-out duration-500 
        hover:cursor-pointer hover:shadow-gray-400 hover:shadow-lg rounded-[10px] font-semibold'>
          Explore Categories</button>
        
      </div>
    </div>
    <div className='w-[70%] shadow-lg rounded-[20px] hover:scale-105 ease-out duration-700 hover:shadow-gray-400'>
        <img src={books} className='w-full rounded-[20px]'/>
    </div>
    </div>
    <hr className='w-[95%] m-auto mb-10 text-gray-300'/>
    </div>
    <Bestseller/>
    <hr className='w-[95%] m-auto mt-15 mb-10 text-gray-300'/>


    {/* Browse by Categories */}

    <div className='flex flex-col justify-center items-center gap-2'>
      <div className='text-3xl font-[Poppins] font-bold'>Browse by Category</div>
      <div className='font-[Poppins] text-gray-500'>Find Books in your favourite genres</div>
      <div className='grid grid-cols-6 gap-10 mt-12'>
        <div className='h-30 w-45 flex flex-col items-start pl-6 justify-center text-[18px] 
          font-semibold font-[Poppins] rounded-[13px] bg-[#3081ff] shadow-lg text-white
          hover:cursor-pointer hover:scale-110 ease-out duration-500 hover:shadow-blue-400'>
          <img src='/stack-of-books.png' className='h-12 mb-2'/>
          Fiction
          </div>
        <div className='h-30 w-45 flex flex-col items-start pl-6 justify-center text-[18px] 
          font-semibold font-[Poppins] rounded-[13px] bg-[#af59ff] shadow-lg text-white
          hover:cursor-pointer hover:scale-110 ease-out duration-500 hover:shadow-purple-400'>
          <img src='/laptop.png' className='h-12 mb-2'/>
          Technology
          </div>
        <div className='h-30 w-45 flex flex-col items-start pl-6 justify-center text-[18px] 
          font-semibold font-[Poppins] rounded-[13px] bg-[#00c65b] shadow-lg text-white
          hover:cursor-pointer hover:scale-110 ease-out duration-500 hover:shadow-green-400'>
          <img src='/school-bag.png' className='h-12 mb-2'/>
          Business
          </div>
        <div className='h-30 w-45 flex flex-col items-start pl-6 justify-center text-[18px] 
          font-semibold font-[Poppins] rounded-[13px] bg-[#e7a700] shadow-lg text-white
          hover:cursor-pointer hover:scale-110 ease-out duration-500 hover:shadow-yellow-400'>
          <img src='/star.png' className='h-12 mb-2'/>
          Self Help
          </div>
        <div className='h-30 w-45 flex flex-col items-start pl-6 justify-center text-[18px] 
          font-semibold font-[Poppins] rounded-[13px] bg-[#f14097] shadow-lg text-white
          hover:cursor-pointer hover:scale-110 ease-out duration-500 hover:shadow-pink-400'>
          <img src='/microscope.png' className='h-12 mb-2'/>
          Science
          </div>
        <div className='h-30 w-45 flex flex-col items-start pl-6 justify-center text-[18px] 
          font-semibold font-[Poppins] rounded-[13px] bg-[#fd6f00] shadow-lg text-white
          hover:cursor-pointer hover:scale-110 ease-out duration-500 hover:shadow-orange-400'>
          <img src='/clock.png' className='h-12 mb-2'/>
          History
          </div>
      </div>
    </div>

    </div>
    <Footer/>
    </>

  )
}

export default Home
