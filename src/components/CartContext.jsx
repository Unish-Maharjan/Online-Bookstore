import { createContext, useContext, useReducer } from "react";
import { CartReducer, initialState } from "./CartReducer";

const CartContext = createContext();

const API_BASE_URL = "https://bookstore-backend-1-nc4r.onrender.com";


function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.id || null;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(CartReducer, initialState);

  // Sync ADD_TO_CART with the backend
  const addToCart = async (item) => {
    const userId = getUserId();

    if (!userId) {
      console.error("User not logged in");
      return;
    }

    // Update UI immediately (optimistic update)
    dispatch({ type: "ADD_TO_CART", payload: item });

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          bookId: item._id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to add to cart:", error.message);
      }
    } catch (err) {
      console.error("Cart API error:", err.message);
    }
  };

  // Sync INCREMENT with the backend
  const increment = async (bookId) => {
    const userId = getUserId();
    if (!userId) return;

    dispatch({ type: "INCREMENT", payload: bookId });

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId, quantity: 1 }),
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to increment:", error.message);
      }
    } catch (err) {
      console.error("Cart API error:", err.message);
    }
  };

  // Sync DECREMENT with the backend
  const decrement = async (bookId) => {
    const userId = getUserId();
    if (!userId) return;

    dispatch({ type: "DECREMENT", payload: bookId });

    try {
      await fetch(`${API_BASE_URL}/cart/${userId}/item/${bookId}`, {
        method: "PATCH",
      });
    } catch (err) {
      console.error("Cart API error:", err.message);
    }
  };

  // Sync REMOVE_FROM_CART with the backend
  const removeFromCart = async (bookId) => {
    const userId = getUserId();
    if (!userId) return;

    dispatch({ type: "REMOVE_FROM_CART", payload: bookId });

    try {
      await fetch(`${API_BASE_URL}/cart/${userId}/item/${bookId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Cart API error:", err.message);
    }
  };

  return (
    <CartContext.Provider value={{ state, dispatch, addToCart, increment, decrement, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}