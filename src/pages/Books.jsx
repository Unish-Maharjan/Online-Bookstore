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
    const [filterOpen, setFilterOpen] = useState(false);

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

    const FilterPanel = () => (
        <div className='px-6 py-6 w-full border border-gray-200 rounded-[20px] shadow-md bg-white'>
            <div className='font-[Poppins] font-semibold text-[20px] mb-4'>
                <i className="fa-solid fa-sliders text-blue-500 mr-2"></i>
                Filters
            </div>
            <div className='flex flex-col gap-2'>
                <label className='text-[14px] font-[Poppins]'>Search</label>
                <div className='flex gap-3 border border-gray-400 px-3 py-2 rounded-[10px] hover:border-black'>
                    <i className="fa-solid fa-magnifying-glass text-gray-500 self-center"></i>
                    <input
                        type='text'
                        placeholder='Search books'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='outline-none text-[15px] border-0 w-full'
                    />
                </div>

                <label className='text-[14px] font-[Poppins] mt-4'>Category</label>
                <div className='flex border border-gray-400 px-3 py-2 rounded-[50px] hover:border-black'>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='border-0 outline-0 w-full text-gray-500 hover:cursor-pointer font-[Poppins] text-[14px]'
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

                <label className='text-[14px] font-[Poppins] mt-4'>Price Range: $0 - ${maxPrice}</label>
                <input
                    type='range'
                    min={0}
                    max={100}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className='accent-blue-700'
                />

                <label className='text-[14px] font-[Poppins] mt-4'>Minimum Rating</label>
                <div className='flex border border-gray-400 px-3 py-2 rounded-[50px] hover:border-black'>
                    <select
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        className='border-0 outline-0 w-full text-gray-500 hover:cursor-pointer font-[Poppins] text-[14px]'
                    >
                        <option value="all">All Ratings</option>
                        <option value="4">4+ stars</option>
                        <option value="4.5">4.5+ stars</option>
                    </select>
                </div>

                <label className='text-[14px] font-[Poppins] mt-6'>Availability</label>
                <div className='flex gap-2 items-center'>
                    <input
                        type="checkbox"
                        id='stock'
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <label htmlFor='stock' className='text-[14px] font-[Poppins]'>In Stock Only</label>
                </div>

                <button
                    onClick={handleReset}
                    className='bg-red-500 mt-6 text-white font-[Poppins] w-[70%] m-auto rounded-[5px] py-1.5'
                >
                    Clear All
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className='flex flex-col bg-[#f8fafc] pb-20 min-h-screen'>

                <div className='font-bold font-[Poppins] text-3xl sm:text-4xl px-6 sm:px-10 pt-10 text-center sm:text-left'>
                    All Books
                </div>

                <div className='flex sm:hidden px-6 mt-5 justify-between items-center'>
                    <span className='text-gray-500 font-[Poppins] text-sm'>
                        Showing {filteredBooks?.length || 0} books
                    </span>
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className='flex items-center gap-2 bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-full'
                    >
                        <i className="fa-solid fa-sliders"></i>
                        Filters
                    </button>
                </div>

                {filterOpen && (
                    <div className='sm:hidden px-6 mt-4'>
                        <FilterPanel />
                    </div>
                )}

                <div className='flex w-full px-6 sm:px-10 gap-8 mt-6'>

                    <div className='hidden sm:block w-65 shrink-0 mt-8 self-start sticky top-24'>
                        <FilterPanel />
                    </div>

                    <div className='flex-1 min-w-0'>
                        <div className='mb-6 mt-0 sm:mt-8 hidden sm:flex items-center justify-between'>
                            <div className='text-gray-500 font-[Poppins]'>
                                Showing {filteredBooks?.length || 0} books
                            </div>
                        </div>

                        {filteredBooks?.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-60 text-gray-400 font-[Poppins]'>
                                <i className="fa-solid fa-book-open text-5xl mb-4"></i>
                                <p className='text-xl'>No books match your filters</p>
                                <button onClick={handleReset} className='mt-4 text-indigo-500 underline'>Clear filters</button>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {filteredBooks?.map((product) => (
                                    <div
                                        key={product._id}
                                        className='bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group
                                        transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col'
                                    >
                                        <div className='overflow-hidden rounded-t-2xl h-56 sm:h-64'
                                            onClick={() => getSingleProductId(product._id)}>
                                            <img
                                                src={product?.image}
                                                alt={product?.title}
                                                className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
                                            />
                                        </div>

                                        <div className='p-4 flex flex-col flex-1'>
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

                                            <p className='text-[18px] font-bold text-gray-900 leading-snug line-clamp-1'
                                                onClick={() => getSingleProductId(product._id)}>
                                                {product?.title}
                                            </p>

                                            <p className='text-[13px] text-gray-400 mt-1 mb-3'
                                                onClick={() => getSingleProductId(product._id)}>
                                                {product?.author}
                                            </p>

                                            <div className='flex items-center justify-between px-1 mt-auto'>
                                                <span className='text-[18px] font-bold text-indigo-500'
                                                    onClick={() => getSingleProductId(product._id)}>
                                                    ${product?.price}
                                                </span>
                                                <button
                                                    className='flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 active:scale-95
                                                    text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-150'
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