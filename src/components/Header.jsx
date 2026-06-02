import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useCart } from './CartContext'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const totalItems = state.cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const admin = JSON.parse(localStorage.getItem('admin') || 'null')

  const isActive = (path) => location.pathname === path

  const handleUserClick = () => {
    setMenuOpen(false)
    navigate(admin ? '/admin-dashboard' : '/user')
  }

  const userLabel = admin ? 'Dashboard' : user ? 'My Account' : 'Sign In'

  const navLinks = [
    { to: '/home', label: 'Home', icon: 'fa-house' },
    { to: '/books', label: 'Books', icon: 'fa-book' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#5951e6]/10 bg-white/90 backdrop-blur-xl shadow-[0_2px_24px_rgba(89,81,230,0.07)]">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">

          {/* Logo */}
          <Link
            to="/home"
            className="group flex flex-shrink-0 items-center gap-2.5 font-serif text-[21px] font-bold text-[#1a1a2e] transition-colors duration-200 hover:text-[#5951e6]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#5951e6] text-[15px] text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
              <i className="fa-solid fa-book-open" />
            </span>
            BookStore
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center gap-1 sm:flex">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`rounded-lg px-4 py-2 text-[15px] font-medium transition-colors duration-200 ${
                  isActive(to)
                    ? 'bg-[#ebe9ff] text-[#5951e6]'
                    : 'text-gray-500 hover:bg-[#ebe9ff] hover:text-[#5951e6]'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden flex-shrink-0 items-center gap-1.5 sm:flex">
            {/* Cart */}
            <Link to="/cart">
              <button className="relative flex h-[42px] w-[42px] items-center justify-center rounded-[10px] text-[18px] text-[#1a1a2e] transition-all duration-200 hover:-translate-y-px hover:bg-[#ebe9ff] hover:text-[#5951e6]">
                {totalItems > 0 && (
                  <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] animate-[pop_0.3s_cubic-bezier(.34,1.56,.64,1)] items-center justify-center rounded-full border-2 border-white bg-green-400 px-1 text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
                <i className="fa-solid fa-cart-shopping" />
              </button>
            </Link>

            {/* Account CTA */}
            <button
              onClick={handleUserClick}
              className="flex items-center gap-2 rounded-[10px] bg-[#5951e6] px-[18px] py-2 text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#4740d4] hover:shadow-[0_4px_14px_rgba(89,81,230,0.35)]"
            >
              <i className="fa-regular fa-user text-[13px]" />
              {userLabel}
            </button>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex items-center gap-1 sm:hidden">
            <Link to="/cart">
              <button className="relative flex h-[42px] w-[42px] items-center justify-center rounded-[10px] text-[19px] text-[#1a1a2e] hover:bg-[#ebe9ff] hover:text-[#5951e6]">
                {totalItems > 0 && (
                  <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-green-400 px-1 text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
                <i className="fa-solid fa-cart-shopping" />
              </button>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-[42px] w-[42px] flex-col items-center justify-center gap-[5px] rounded-[10px] transition-colors hover:bg-[#ebe9ff]"
              aria-label="Toggle menu"
            >
              <span className={`block h-[2px] w-[22px] rounded-sm bg-[#1a1a2e] origin-center transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45 bg-[#5951e6]' : ''}`} />
              <span className={`block h-[2px] w-[22px] rounded-sm bg-[#1a1a2e] transition-all duration-300 ${menuOpen ? 'scale-x-0 opacity-0' : ''}`} />
              <span className={`block h-[2px] w-[22px] rounded-sm bg-[#1a1a2e] origin-center transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45 bg-[#5951e6]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-b border-[#5951e6]/10 bg-white/95 backdrop-blur-xl transition-all duration-[380ms] ease-in-out sm:hidden ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 pb-5 pt-3">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 rounded-[10px] px-4 py-3 text-[15px] font-medium transition-colors duration-200 ${
                isActive(to)
                  ? 'bg-[#ebe9ff] text-[#5951e6]'
                  : 'text-[#1a1a2e] hover:bg-[#ebe9ff] hover:text-[#5951e6]'
              }`}
            >
              <i className={`fa-solid ${icon} w-4 text-center text-[14px]`} />
              {label}
            </Link>
          ))}

          <div className="my-2 h-px bg-[#5951e6]/10" />

          <button
            onClick={handleUserClick}
            className="flex w-full items-center gap-3 rounded-[10px] bg-[#5951e6] px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#4740d4]"
          >
            <i className="fa-regular fa-user w-4 text-center text-[14px]" />
            {userLabel}
          </button>
        </div>
      </div>
    </>
  )
}

export default Header