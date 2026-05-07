import React from 'react'

const Bestseller = () => {
  return (
    <>
    <div className='flex justify-between'>
      <div className='flex gap-3 px-8 mt-10 items-center'>
        <div className='h-12 w-10 flex items-center justify-center rounded-[15px] bg-amber-300 text-orange-600'>
            <i class="fa-solid fa-arrow-trend-up"></i>
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
        <button className='hover:bg-gray-950/10 p-2 px-3 hover:cursor-pointer rounded-[5px]'>
            View all <i class="fa-solid fa-angle-right"></i>
        </button>
      </div>
    </div>
    </>
  )
}

export default Bestseller
