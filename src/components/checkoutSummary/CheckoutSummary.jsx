import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotalAmounts,
  selectCartTotalQuantity,
} from "../.././redux/slice/cartSlice";
import { selectDelieveryFee } from "../../redux/slice/orderSlice";
import Card from "../card/Card";
import styles from "./checkoutSummary.module.scss";

const CheckoutSummary = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmounts);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const delieveryFee = useSelector(selectDelieveryFee)
  const subtotal = cartTotalAmount + delieveryFee
  

  return (
    <div>
      <h3>Checkout Summary</h3>
      <div>
        {cartItems.lenght === 0 ? (
          <>
            <p>No item in your cart.</p>
            <button className="--btn">
              <Link to="/#products">Back To Shop</Link>
            </button>
          </>
        ) : (
          <div>
            <p>
              <b>{`Cart item(s): ${cartTotalQuantity}`}</b>
            </p>
            <p>
              <b>{`Delievery Fee: NGN ${new Intl.NumberFormat().format(delieveryFee)}`}</b>
            </p>
            <div className={styles.text}>
              <h4>Subtotal:</h4>
              <h3>NGN {new Intl.NumberFormat().format(subtotal)}</h3>
            </div>
            {cartItems.map((item) => {
              const { id, name, price, cartQuantity } = item;
              return (
                <Card key={id} cardClass={styles.card}>
                  <h4>{name}</h4> 
                  <p>Quantity: {cartQuantity}</p>
                  <p>Unit price: NGN {new Intl.NumberFormat().format(price)}</p>
                  <p>
                    Set price:{" "}
                    NGN {new Intl.NumberFormat().format(price * cartQuantity)} (adding quantity)
                  </p>
                  <p>
                    Total price to checkout: NGN {new Intl.NumberFormat().format(subtotal)} (Delievery fee included)
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummary;
