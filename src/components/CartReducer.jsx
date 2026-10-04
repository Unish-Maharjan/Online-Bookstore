export const initialState = {
  cartItems: [],
};

export class CartStore {
  constructor(state = initialState) {
    this.state = {
      ...state,
      cartItems: Array.isArray(state?.cartItems) ? [...state.cartItems] : [],
    };
  }

  addItem(item) {
    const existingItem = this.state.cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      this.state = {
        ...this.state,
        cartItems: this.state.cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ),
      };
      return this.state;
    }

    this.state = {
      ...this.state,
      cartItems: [...this.state.cartItems, { ...item, quantity: 1 }],
    };

    return this.state;
  }

  increment(bookId) {
    this.state = {
      ...this.state,
      cartItems: this.state.cartItems.map((item) =>
        item._id === bookId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    };

    return this.state;
  }

  decrement(bookId) {
    this.state = {
      ...this.state,
      cartItems: this.state.cartItems
        .map((item) =>
          item._id === bookId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0),
    };

    return this.state;
  }

  removeItem(bookId) {
    this.state = {
      ...this.state,
      cartItems: this.state.cartItems.filter((item) => item._id !== bookId),
    };

    return this.state;
  }

  getSummary() {
    const subtotal = this.state.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping = 5.99;
    const tax = subtotal * 0.1;

    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
    };
  }

  dispatch(action) {
    switch (action.type) {
      case "ADD_TO_CART":
        return this.addItem(action.payload);

      case "DECREMENT":
        return this.decrement(action.payload);

      case "INCREMENT":
        return this.increment(action.payload);

      case "REMOVE_FROM_CART":
        return this.removeItem(action.payload);

      default:
        return this.state;
    }
  }
}

export function CartReducer(state, action) {
  const cartStore = new CartStore(state);
  return cartStore.dispatch(action);
}