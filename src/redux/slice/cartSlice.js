import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  savedItems: localStorage.getItem("savedItems")
    ? JSON.parse(localStorage.getItem("savedItems"))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmounts: 0,
  previousURL: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    ADD_TO_CART: (state, action) => {
      const productIndex = state.cartItems.findIndex(
        (
          item //returns -1
        ) => item.id === action.payload.id
      );
      if (productIndex >= 0) {
        //item already exists
        //increase the cart quantity
        state.cartItems[productIndex].cartQuantity += 1;
      } else {
        //item dosent exist
        //add item to cart
        let tempProducts = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProducts);
        toast.success(`${action.payload.name} added to cart`, {
          position: "top-left",
          pauseOnFocusLoss: false,
        });
      }
      //save cart to LS
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    DECREASE_CART: (state, action) => {
      const productIndex = state.cartItems.findIndex(
        (
          item //returns -1
        ) => item.id === action.payload.id
      );
      if (state.cartItems[productIndex].cartQuantity > 1) {
        state.cartItems[productIndex].cartQuantity -= 1;
      } else if (state.cartItems[productIndex].cartQuantity === 1) {
        const newCartItem = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );
        state.cartItems = newCartItem;
        toast.info(`${action.payload.name} removed from your cart`, {
          position: "top-left",
          pauseOnFocusLoss: false,
        });
      }
      //save cart to LS
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    REMOVE_FROM_CART: (state, action) => {
      const newCartItem = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      state.cartItems = newCartItem;
      toast.info(`${action.payload.name} removed from your cart`, {
        position: "top-left",
        pauseOnFocusLoss: false,
      });
      //save cart to LS
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    CLEAR_CART: (state) => {
      state.cartItems = [];
      toast.success("Your cart has been cleared", {
        position: "top-left",
        pauseOnFocusLoss: false,
      });
      //save cart to LS
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    CALCULATE_SUBTOTAL: (state) => {
      const subtotalArray = [];
      state.cartItems.map((item) => {
        const { price, cartQuantity } = item;
        const cartItemAmount = price * cartQuantity;
        return subtotalArray.push(cartItemAmount);
      });
      const totalAmount = subtotalArray.reduce((curr, init) => {
        return curr + init;
      }, 0);
      state.cartTotalAmounts = totalAmount;
    },
    CALCULATE_TOTAL_QUANTITY: (state) => {
      const totalQtyArray = [];
      state.cartItems.map((item) => {
        const { cartQuantity } = item;
        const quantity = cartQuantity;
        return totalQtyArray.push(quantity);
      });
      const totalQty = totalQtyArray.reduce((curr, init) => {
        return curr + init;
      }, 0);
      state.cartTotalQuantity = totalQty;
    },
    SAVE_URL: (state, action) => {
      state.previousURL = action.payload;
    },
    SAVE_FOR_LATER: (state, action) => {
      console.log(action.payload)
      let tempProducts = { ...action.payload, savedQuantity: 1 };
      state.savedItems.push(tempProducts);
      toast.success(`${action.payload.name} was saved for later`, {
        position: "top-left",
        pauseOnFocusLoss: false,
      });
      localStorage.setItem("savedItems", JSON.stringify(state.savedItems));
    },
    REMOVE_FROM_SAVED: (state, action) => {
      const newSavedItem = state.savedItems.filter(
        (item) => item.id !== action.payload.id
      );
      state.savedItems = newSavedItem;
      toast.info(`${action.payload.name} removed from your saved items`, {
        position: "top-left",
        pauseOnFocusLoss: false,
      });
      //save cart to LS
      localStorage.setItem("savedItems", JSON.stringify(state.savedItems));
    }
  },
});

export const {
  ADD_TO_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  SAVE_URL,
  SAVE_FOR_LATER,
  REMOVE_FROM_SAVED
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectSavedItems = (state) => state.cart.savedItems;
export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity;
export const selectCartTotalAmounts = (state) => state.cart.cartTotalAmounts;
export const selectPreviousURL = (state) => state.cart.previousURL;

export default cartSlice.reducer;
