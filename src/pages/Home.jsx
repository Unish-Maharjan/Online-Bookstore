import React from 'react'
import bg from '../assets/bg.png';
import Header from '../components/Header'
import Footer from '../components/Footer'
import Bestseller from '../components/Bestseller';
import Latestarrival from '../components/Latestarrivals';
import Allbooks from '../components/Allbooks';


const Home = () => {
  return (
    <>
    <Header/>
    <div className='relative overflow-hidden flex flex-col py-20 px-8 gap-7 h-90'>
      <img src={bg} className='absolute inset-0 -z-10 w-full h-full object-cover' alt='Background'/>

      <div className='flex flex-col gap-5'>
        <h1 className='text-5xl text-white font-[Poppins] font-bold'>
          Discover Your Next Great Read
        </h1>

        <h3 className='text-xl font-[Poppins] text-white w-[50%] font-light'>
          Explore thousands of books across all genres. From timeless classics to the latest bestsellers.
        </h3>
      </div>

      <div className='flex gap-6'>
        <button className='p-2 w-60 text-[18px] bg-white text-blue-700 hover:cursor-pointer'>BROWSE COLLECTION</button>
        <button className='text-white border px-6 text-[18px] rounded-[5px] hover:cursor-pointer hover:bg-gray-50/10 '>MANAGE BOOKS</button>
      </div>
    </div>
    <Bestseller/>
    <hr className='w-[95%] m-auto mt-15 mb-10 text-gray-300'/>
    <Latestarrival/>
    <hr className='w-[95%] m-auto mt-15 mb-10 text-gray-300'/>
    <Allbooks/>
    <Footer/>
    </>

  )
}

export default Home
