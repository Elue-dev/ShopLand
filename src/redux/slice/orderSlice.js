import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderHistory: [],
  addressHistory: [],
  totalOrderAmount: null,
  successURL: "",
  delieveryFee: 3000
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    STORE_ORDERS: (state, action) => {
      state.orderHistory = action.payload;
    },
    CALCULATE_TOTAL_ORDER_AMOUNTS: (state) => {
      const subtotalArray = [];
      state.orderHistory.map((item) => {
        const { orderAmount } = item;
        return subtotalArray.push(orderAmount);
      });
      const totalAmount = subtotalArray.reduce((curr, init) => {
        return curr + init;
      }, 0);
      state.totalOrderAmount = totalAmount;
    },
    STORE_ADDRESS: (state, action) => {
      state.addressHistory = action.payload;
    },
    SAVE_SUCCESS_URL: (state, action) => {
      state.successURL = action.payload;
    },
  },
});

export const { STORE_ORDERS, STORE_ADDRESS, CALCULATE_TOTAL_ORDER_AMOUNTS,  SAVE_SUCCESS_URL } =
  orderSlice.actions;

export const selectOrderHistory = (state) => state.orders.orderHistory;
export const selectAddressHistory = (state) => state.orders.addressHistory;
export const selectTotalOrderAmount = (state) => state.orders.totalOrderAmount;
export const selectSuccessURL = (state) => state.orders.successURL;
export const selectDelieveryFee = (state) => state.orders.delieveryFee;

export default orderSlice.reducer;
