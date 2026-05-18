import React, { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useGetBooksQuery } from '../services/bookApi'
import { useCart } from '../components/CartContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

const Books = () => {
    const { data } = useGetBooksQuery();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [maxPrice, setMaxPrice] = useState(100);
    const [minRating, setMinRating] = useState('all');
    const [inStockOnly, setInStockOnly] = useState(false);

    const handleAddToCart = async (item) => {
        await addToCart(item);
        toast.success(`${item.title} added to cart!`, {
            duration: 3000,
            style: { padding: '14px', color: '#12923d', background: '#ecfdf3' },
            iconTheme: { primary: '#12923d' },
        });
    };

    const getSingleProductId = (id) => {
        navigate(`/books/${id}`)
    }

    const handleReset = () => {
        setSearch('');
        setCategory('all');
        setMaxPrice(100);
        setMinRating('all');
        setInStockOnly(false);
    }

    const filteredBooks = data?.filter((product) => {
        const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) ||
            product.author.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'all' || product.category.toLowerCase() === category;
        const matchesPrice = product.price <= maxPrice;
        const matchesRating = minRating === 'all' || product.rating >= parseFloat(minRating);
        const matchesStock = !inStockOnly || product.stock > 0;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
    });

    return (
        <>
            <Header />

            <div className='flex flex-col justify-center items-center gap-3 mr-10 bg-[#f8fafc] pb-20'>

                <div className='font-bold font-[Poppins] text-4xl px-8 pt-10'>
                    All Books
                </div>

                <div className='flex w-full px-8 gap-8'>

                    {/* FILTER SECTION */}
                    <div className='px-8 mt-15 w-[25%] border border-gray-200 rounded-[20px] shadow-md h-148 bg-white'>

                        <div className='font-[Poppins] mt-6 font-semibold text-[23px]'>
                            <i className="fa-solid fa-sliders text-blue-500 mr-1"></i>
                            Filters
                        </div>

                        <div className='flex flex-col mt-6 gap-2'>

                            {/* SEARCH */}
                            <label className='text-[14px] font-[Poppins]'>Search</label>
                            <div className='flex gap-4 border border-gray-400 p-1 px-3 ml-2 rounded-[10px] py-1.5 hover:border-black'>
                                <i className="fa-solid fa-magnifying-glass text-gray-500 self-center"></i>
                                <input
                                    type='text'
                                    placeholder='Search books'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className='outline-none rounded-[5px] text-[16px] border-0 w-full'
                                />
                            </div>

                            {/* CATEGORY */}
                            <label className='text-[14px] font-[Poppins] mt-4'>Category</label>
                            <div className='flex gap-4 border border-gray-400 p-1 px-3 ml-2 rounded-[50px] py-2 mt-1 hover:border-black'>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className='border-0 outline-0 w-full text-gray-500 px-2 hover:cursor-pointer font-[Poppins] text-[14px]'
                                >
                                    <option value="all">All Categories</option>
                                    <option value="fiction">Fiction</option>
                                    <option value="technology">Technology</option>
                                    <option value="business">Business</option>
                                    <option value="selfhelp">Self Help</option>
                                    <option value="science">Science</option>
                                    <option value="history">History</option>
                                </select>
                            </div>

                            {/* PRICE */}
                            <div className='flex flex-col gap-3'>
                                <label className='text-[14px] font-[Poppins] mt-4'>
                                    Price Range: $0 - ${maxPrice}
                                </label>
                                <input
                                    type='range'
                                    min={0}
                                    max={100}
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className='accent-blue-700'
                                />
                            </div>

                            {/* RATING */}
                            <label className='text-[14px] font-[Poppins] mt-4'>Minimum Rating</label>
                            <div className='flex gap-4 border border-gray-400 p-1 px-3 ml-2 rounded-[50px] py-2 mt-1 hover:border-black'>
                                <select
                                    value={minRating}
                                    onChange={(e) => setMinRating(e.target.value)}
                                    className='border-0 outline-0 w-full text-gray-500 px-2 hover:cursor-pointer font-[Poppins] text-[14px]'
                                >
                                    <option value="all">All Ratings</option>
                                    <option value="4">4+ stars</option>
                                    <option value="4.5">4.5+ stars</option>
                                </select>
                            </div>

                            {/* STOCK */}
                            <label className='text-[14px] font-[Poppins] mt-8'>Availability</label>
                            <div className='flex gap-2 items-center'>
                                <input
                                    type="checkbox"
                                    id='stock'
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                />
                                <label htmlFor='stock'>In Stock Only</label>
                            </div>

                            <button
                                onClick={handleReset}
                                className='bg-red-500 mt-6 text-white font-[Poppins] w-[70%] m-auto rounded-[5px] py-1'
                            >
                                clear all
                            </button>

                        </div>
                    </div>

                    {/* BOOKS SECTION */}
                    <div className='flex-1'>

                        {/* TOP BAR */}
                        <div className='mb-8 mt-15 flex items-center justify-between'>
                            <div className='text-gray-500 font-[Poppins]'>
                                Showing {filteredBooks?.length || 0} books
                            </div>
                        </div>

                        {/* BOOK CARDS */}
                        {filteredBooks?.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-60 text-gray-400 font-[Poppins]'>
                                <i className="fa-solid fa-book-open text-5xl mb-4"></i>
                                <p className='text-xl'>No books match your filters</p>
                                <button onClick={handleReset} className='mt-4 text-indigo-500 underline'>Clear filters</button>
                            </div>
                        ) : (
                            <div className='grid grid-cols-3 gap-10'>
                                {filteredBooks?.map((product) => (
                                    <div
                                        key={product._id}
                                        className='bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group h-120 w-75 
                                        transition-all duration-300 hover:scale-105 hover:shadow-2xl'
                                    >
                                        <div className='overflow-hidden rounded-t-2xl h-[65%]'
                                            onClick={() => getSingleProductId(product._id)}>
                                            <img
                                                src={product?.image}
                                                alt={product?.title}
                                                className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
                                            />
                                        </div>

                                        <div className='p-3'>
                                            <div className='flex items-center gap-2 mb-2'
                                                onClick={() => getSingleProductId(product._id)}>
                                                <span className='text-[12px] font-medium text-indigo-500 bg-indigo-50 px-3 py-0.5 rounded-full'>
                                                    {product?.category}
                                                </span>
                                                <span className='flex items-center gap-1 text-[12px] font-medium text-gray-700'>
                                                    <span className='text-amber-400'>★</span>
                                                    {product?.rating}
                                                </span>
                                            </div>

                                            <p className='text-[20px] font-bold text-gray-900 leading-snug h-7 overflow-hidden'
                                                onClick={() => getSingleProductId(product._id)}>
                                                {product?.title}
                                            </p>

                                            <p className='text-[14px] text-gray-400 mt-1 mb-3'
                                                onClick={() => getSingleProductId(product._id)}>
                                                {product?.author}
                                            </p>

                                            <div className='flex items-center justify-between px-1'>
                                                <span className='text-[18px] font-bold text-indigo-500 mt-2'
                                                    onClick={() => getSingleProductId(product._id)}>
                                                    ${product?.price}
                                                </span>
                                                <button
                                                    className='flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 active:scale-95 
                                                    text-white text-sm font-semibold px-4 py-2 mt-2 rounded-full transition-all duration-150'
                                                    onClick={() => handleAddToCart(product)}
                                                >
                                                    <i className="fa-solid fa-cart-arrow-down"></i>
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Books