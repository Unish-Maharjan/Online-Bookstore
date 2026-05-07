import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'


const Home = () => {
  return (
    <>
    <Header/>
    <div className='flex flex-col py-20 px-8 gap-7 bg-contain shadow-inner shadow-blue-400' style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da')",
    }}>
    <div className='flex flex-col gap-5'>
        <h1 className='text-5xl text-white font-[Poppins] font-semibold'>Discover Your Next Great Read</h1>
        <h3 className='text-xl font-[Poppins] text-white w-[50%]'>Explore thousands of books across all genres. From timless classics to the latest bestsellers.</h3>
    </div>
    <div className='flex gap-6'>
        <button>BROWSE COLLECTION</button>
        <button>MANAGE BOOKS</button>
    </div>
    </div>
    <Footer/>
    </>

  )
}

export default Home
