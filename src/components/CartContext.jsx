import { createContext, useContext, useReducer } from "react";
import { CartReducer, initialState } from "./CartReducer";

const CartContext = createContext();

export function CartProvider({children}){
    const [state, dispatch] = useReducer(CartReducer, initialState);

    return(
        <CartContext.Provider value={{state, dispatch}}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart(){
    return useContext(CartContext);
}