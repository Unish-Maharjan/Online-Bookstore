import React from 'react'
import { useGetproductQuery } from '../services/productApi'

const Allbooks = () => {

  const {data} = useGetproductQuery()
  console.log(data);
  return (
    <>
    
        <div className='list-none px-8'>
            <li className='text-3xl font-[Poppins] font-bold'>All Books</li>
            <li className='font-[Poppins] font-light text-gray-500'>Browse our complete collection</li>
        </div>

        <div className='flex justify-between px-10 mt-12 bg-[#ffffff] shadow-lg p-5 w-[95%] m-auto'>
            <div className='flex items-center justify-start border gap-5 w-[40%] text-right border-gray-400 rounded-[5px]'>
                <label for='search' className='w-[5%] hover:cursor-pointer'><i class="fa-solid fa-magnifying-glass text-gray-500 p-3"></i></label>
                <input type='text' placeholder='Search by title or author' className='h-full w-full border-0 outline-none search'/>
            </div>
            <div className='flex items-center justify-between hover:cursor-pointer'>
                <div className='w-50 flex px-3 group'>
                    <fieldset className='border w-full p-1 rounded-[5px] border-gray-400 group-hover:border-black'>
                        <legend className='text-[13px] text-gray-400 group-hover:text-black'>Category</legend>
                    <select className='border-0 outline-0 px-2 hover:cursor-pointer'>
                        <option>All Categories</option>
                        <option>Classic Literature</option>
                        <option>Science Fiction</option>
                        <option>Fantasy</option>
                        <option>Romance</option>
                        <option>Mystery</option>         
                    </select>
                    </fieldset>
                </div>
                <div className='flex gap-1 mt-2'>
                    <button className='border px-2 py-1 border-gray-400 rounded-[5px] hover:bg-gray-100 hover:cursor-pointer'><i class="fa-solid fa-table-cells"></i></button>
                    <button className='border px-2 py-1 border-gray-400 rounded-[5px] hover:bg-gray-100 hover:cursor-pointer'><i class="fa-solid fa-list"></i></button>
                </div>
            </div>
        </div>

        <div className='grid grid-cols-4 mt-19 px-8 gap-5'>
        {data?.products?.map((data)=>(
        <article key={data.id} className='rounded-[10px] shadow-xl overflow-hidden bg-white group'>
          
          <div className='h-105 overflow-hidden'>
            <img
              src={data?.images}
              className='w-full h-full object-cover object-center transition duration-350 group-hover:scale-105'
              alt=''
            />
            
          </div>

          <div className='p-4'>
            <div className='list-none'>
              <li className='text-[20px] font-semibold group-hover:text-blue-500 h-9 overflow-hidden'>
                {data?.title}
              </li>

              <li className='text-gray-600 mt-1 text-[14px]'>
                J.R.R Tolkien
              </li>

              <li className='py-1 font-medium'>
                <i className="fa-solid fa-star text-yellow-300 mr-2"></i>
                {data?.rating}
              </li>

              <li className='text-gray-500 text-[14px]'>
                Fantasy
              </li>
            </div>

            <hr className='my-4 text-gray-300'/>

            <div className='flex justify-between items-center'>
              <div className='list-none'>
                <li className='text-[28px] font-bold'>${data?.price}</li>
                <li className='text-gray-400'>28 in stock</li>
              </div>

              <button className='bg-[#1976d2] text-white p-2 rounded-[5px] px-3 hover:cursor-pointer group-hover:bg-[#1664b2]'>
                <i className="fa-solid fa-cart-arrow-down mr-1"></i>
                ADD
              </button>
            </div>
          </div>
        </article>
        ))};
        </div>

      
    </>
  )
}

export default Allbooks
