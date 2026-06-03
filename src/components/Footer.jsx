import React, { useState } from 'react'
import { Link } from 'react-router'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/books', label: 'Books', badge: 'New' },
    { to: '/cart', label: 'Cart' },
    { to: '/user', label: 'My Account' },
  ]

  const companyLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/blog', label: 'Blog' },
    { to: '/careers', label: 'Careers' },
    { to: '/contact', label: 'Contact' },
  ]

  const socials = [
    { href: '#', icon: 'fa-facebook-f', label: 'Facebook' },
    { href: '#', icon: 'fa-x-twitter', label: 'X / Twitter' },
    { href: '#', icon: 'fa-instagram', label: 'Instagram' },
    { href: '#', icon: 'fa-youtube', label: 'YouTube' },
  ]

  return (
    <>
    <footer className="bg-[#16172b] text-[#e2e4f0] font-[DM_Sans,sans-serif]">
      <div className="max-w-[1100px] mx-auto px-6 pt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 lg:gap-12">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-9 h-9 flex items-center justify-center rounded-[9px] bg-[#5951e6] text-white text-[14px] flex-shrink-0">
              <i className="fa-solid fa-book-open" />
            </span>
            <span className="font-serif text-[22px] font-bold text-white">BookStore</span>
          </div>
          <p className="text-[14px] text-[#8b8fa8] leading-[1.75] max-w-[220px] mb-5">
            Your one-stop shop for amazing books. Discover, read, and grow every day.
          </p>
          <div className="flex gap-2">
            {socials.map(({ href, icon, label }) => (
              <a
                key={icon}
                href={href}
                title={label}
                className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-[#8b8fa8] text-[14px] no-underline transition-all duration-200 hover:bg-[#5951e6] hover:border-[#5951e6] hover:text-white hover:-translate-y-0.5"
              >
                <i className={`fa-brands ${icon}`} />
              </a>
            ))}
          </div>
        </div>

        {/* Navigate */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[#5951e6] uppercase mb-4">Navigate</p>
          <div className="flex flex-col gap-0.5">
            {navLinks.map(({ to, label, badge }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 text-[14px] text-[#8b8fa8] no-underline py-1 w-fit transition-colors duration-200 hover:text-white"
              >
                {label}
                {badge && (
                  <span className="text-[10px] font-semibold px-[7px] py-0.5 rounded-full bg-[#5951e6]/20 text-[#a09af7] tracking-[0.04em]">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[#5951e6] uppercase mb-4">Company</p>
          <div className="flex flex-col gap-0.5">
            {companyLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-[14px] text-[#8b8fa8] no-underline py-1 w-fit transition-colors duration-200 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[#5951e6] uppercase mb-4">Stay in the loop</p>
          <p className="text-[14px] text-[#8b8fa8] leading-[1.6] mb-4">
            New arrivals, reading picks, and exclusive deals.
          </p>
          {subscribed ? (
            <p className="text-[14px] text-[#a09af7] font-medium">
              <i className="fa-solid fa-check mr-2" />
              You're subscribed!
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white/[0.06] border border-white/10 rounded-lg px-[14px] py-2.5 text-[14px] text-[#e2e4f0] placeholder-[#555872] outline-none transition-colors duration-200 focus:border-[#5951e6]"
              />
              <button
                type="submit"
                className="bg-[#5951e6] rounded-lg px-4 py-2.5 text-[14px] font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#4740d4] hover:-translate-y-px border-none cursor-pointer"
              >
                <i className="fa-solid fa-paper-plane text-[13px]" />
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      
      <div className="max-w-[1100px] mx-auto px-6 mt-12 py-5 border-t border-white/[0.07] flex flex-wrap justify-between items-center gap-3">
        <span className="text-[13px] text-[#555872]">© 2026 BookStore. All rights reserved.</span>
        <div className="flex gap-5">
          {['Privacy Policy', 'Terms of Use', 'Cookies'].map((label) => (
            <a
              key={label}
              href="#"
              className="text-[13px] text-[#555872] no-underline transition-colors duration-200 hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
    </>
  )
}

export default Footer