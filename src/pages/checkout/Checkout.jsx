import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import checkoutImg from "../../assets/checkout.webp";
import {
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  selectCartItems,
  selectCartTotalAmounts,
  CLEAR_CART,
} from "../../redux/slice/cartSlice";
import { selectEmail } from "../../redux/slice/authSlice";
import { selectShippingAddress } from "../../redux/slice/checkoutSlice";
import { toast } from "react-toastify";
import { selectUserID, selectUserName } from "../../redux/slice/authSlice";
import PaystackPop from "@paystack/inline-js";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { database } from "../../firebase/firebase";

import styles from "./checkoutDetails.module.scss";
import { useNavigate } from "react-router-dom";
import CheckoutSummary from "../../components/checkoutSummary/CheckoutSummary";
import Card from "../../components/card/Card";
import "./checkoutDetails.module.scss";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmounts);
  const customerEmail = useSelector(selectEmail);
  const cartTotalAmount = useSelector(selectCartTotalAmounts);

  const name = useSelector(selectUserName);
  const userID = useSelector(selectUserID);
  const userEmail = useSelector(selectEmail);

  const shippingAddress = useSelector(selectShippingAddress);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, [dispatch, cartItems]);

  const saveOrder = () => {
    const today = new Date();
    const date = today.toDateString();
    const time = today.toLocaleTimeString();
    const orderConfig = {
      userID,
      userEmail,
      orderDate: date,
      orderTime: time,
      orderAmount: cartTotalAmount,
      orderStatus: "Order Placed...",
      orderNotification: "Your order has been Placed.....",
      cartItems,
      createdAt: Timestamp.now().toDate(),
    };
    try {
      addDoc(collection(database, "Orders"), orderConfig);
      dispatch(CLEAR_CART());
      navigate("/checkout-success");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveAddress = () => {
    const today = new Date();
    const date = today.toDateString();
    const time = today.toLocaleTimeString();
    const addressConfig = {
      userID,
      userEmail,
      city: shippingAddress.city,
      country: shippingAddress.country,
      line1: shippingAddress.line1,
      line2: shippingAddress.line2,
      name: shippingAddress.name,
      phone: shippingAddress.phone,
      state: shippingAddress.state,
      postal_code: shippingAddress.postal_code,
      date,
      time,
      cartItems,
      createdAt: Timestamp.now().toDate(),
    };
    try {
      addDoc(collection(database, "Shipping-Address"), addressConfig);
      dispatch(CLEAR_CART());
      navigate("/checkout-success");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const checkout = () => {
    const initiatePayment = () => {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: process.env.REACT_APP_PAYSTACK_KEY,
        amount: totalAmount * 100,
        email: customerEmail,
        name,
        onSuccess() {
          saveOrder();
          saveAddress();
          navigate("/checkout-success");
        },
        onCancel() {
          console.log("");
        },
      });
    };
    initiatePayment();
  };

  return (
    <>
      <section className={`container ${styles.section}`}>
        <img src={checkoutImg} alt="checkout" style={{ width: "40%" }} />
        <div className={styles.checkout}>
          <div>
            <Card cardClass={styles.card}>
              <CheckoutSummary />
              <br />
              <button
                className="--btn --btn-primary --btn-block"
                onClick={checkout}
              >
                Checkout
              </button>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
