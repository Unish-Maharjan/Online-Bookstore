import { useCart } from "./CartContext";
import { useNavigate } from "react-router";

const SHIPPING = 5.99;
const TAX_RATE = 0.1;

export default function CartSummary() {
  const { state } = useCart();
  const { cartItems } = state;
  const navigate = useNavigate();

  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subTotal * TAX_RATE;
  const total = subTotal + SHIPPING + tax;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 sm:sticky sm:top-6">
      <h2 className="text-[17px] sm:text-[18px] font-bold text-[#0f172a] mb-5">Order Summary</h2>

      <div className="space-y-3 text-sm sm:text-[15px]">
        <div className="flex justify-between">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-gray-600">${subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Shipping</span>
          <span className="text-gray-600">${SHIPPING.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Tax (10%)</span>
          <span className="text-gray-600">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
        <span className="text-[15px] sm:text-[16px] font-bold text-[#0f172a]">Total</span>
        <span className="text-[18px] sm:text-[20px] font-bold text-indigo-600">${total.toFixed(2)}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="mt-5 w-full py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm sm:text-[15px] rounded-xl transition-colors"
      >
        Proceed to Checkout
      </button>
      <button
        onClick={() => navigate("/books")}
        className="mt-3 w-full py-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-[15px] transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
}