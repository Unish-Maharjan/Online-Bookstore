import { useCart } from "./CartContext";

export default function CartItem({ item }) {
  const { dispatch } = useCart();

  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-sm border border-gray-100">
   
      <img
        src={item.image}
        alt={item.title}
        className="w-20 h-24 object-cover rounded-xl"
      />


      <div className="flex-1 min-w-0">
        <h3 className="text-[17px] font-bold text-[#0f172a] leading-snug">{item.title}</h3>
        <p className="text-sm text-gray-400 mt-0.5">{item.author}</p>

      
        <span className="inline-block mt-2 px-3 py-0.5 text-xs text-gray-500 bg-gray-100 rounded-full">
          {item.category}
        </span>

     
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => dispatch({ type: "DECREMENT", payload: item._id })}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-lg leading-none"
          >
            −
          </button>
          <span className="w-5 text-center text-[15px] font-semibold text-[#0f172a]">
            {item.quantity}
          </span>
          <button
            onClick={() => dispatch({ type: "INCREMENT", payload: item._id })}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between h-24">
        <button
          onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item._id })}
          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-trash text-red-400 text-[16px]" />
        </button>
        <span className="text-[18px] font-bold text-indigo-600">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}