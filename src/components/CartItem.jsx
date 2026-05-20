import { useCart } from "./CartContext";

export default function CartItem({ item }) {
  const { increment, decrement, removeFromCart } = useCart();

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-5 shadow-sm border border-gray-100">
      <img
        src={item.image}
        alt={item.title}
        className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] sm:text-[17px] font-bold text-[#0f172a] leading-snug truncate">
          {item.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5 truncate">{item.author}</p>

        <span className="inline-block mt-2 px-2.5 py-0.5 text-xs text-gray-500 bg-gray-100 rounded-full">
          {item.category}
        </span>

        <div className="flex items-center gap-2 sm:gap-3 mt-3">
          <button
            onClick={() => decrement(item._id)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center
             text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-base
              sm:text-lg leading-none"
          >
            −
          </button>
          <span className="w-5 text-center text-sm sm:text-[15px] font-semibold text-[#0f172a]">
            {item.quantity}
          </span>
          <button
            onClick={() => increment(item._id)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-base sm:text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between h-20 sm:h-24 shrink-0">
        <button
          onClick={() => removeFromCart(item._id)}
          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-trash text-red-400 text-[14px] sm:text-[16px]" />
        </button>
        <span className="text-base sm:text-[18px] font-bold text-indigo-600">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}