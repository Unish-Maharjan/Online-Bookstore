export const initialState = {
  cartItems: [],
};

export function CartReducer(state, action) {
  switch (action.type) {

    // ADD TO CART
    case "ADD_TO_CART": {
      const item = action.payload;

      const existingItem = state.cartItems.find(
        (cartItem) => cartItem._id === item._id
      );

      // IF ITEM EXISTS
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((cartItem) =>
            cartItem._id === item._id
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + 1,
                }
              : cartItem
          ),
        };
      }

      // NEW ITEM
      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            ...item,
            quantity: 1,
          },
        ],
      };
    }

    // DECREMENT
    case "DECREMENT": {
      const id = action.payload;

      return {
        ...state,
        cartItems: state.cartItems
          .map((item) =>
            item._id === id
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    }

    // INCREMENT
    case "INCREMENT": {
      const id = action.payload;

      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        ),
      };
    }

    // REMOVE
    case "REMOVE_FROM_CART": {
      const id = action.payload;

      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item._id !== id
        ),
      };
    }

    default:
      return state;
  }
}