import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotalAmounts,
  selectCartTotalQuantity
} from "../../redux/slice/cartSlice";
import Card from "../card/Card";
import styles from './checkoutSummary.module.scss'

export default function CheckoutSummary() {
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmounts);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);



  return <div>
    <h3>CheckoutSummary</h3>
    <div>
      {cartItems.length === 0 ? (
        <>
        <p>NO ITEM(S) IN YOUR CART</p>
        <button className="--btn">
          <Link to='/#products'>Back To Shop</Link>
        </button>
        </>
      ) : (
        <div>
          <p>
            <b>{`Cart Item(s): ${cartTotalQuantity}`}</b>
          </p>
          <div className={styles.text}>
            <h4>Subtotal:</h4>
            <h3>${cartTotalAmount.toFixed(2)}</h3>
          </div>
          {cartItems.map((item, index) => {
            const {id, name, price, cartQuantity} = item
            return (
              <Card key={id} cardClass={styles.card}>
                <h4>Product: {name}</h4>
                <p>Quantity: {cartQuantity}</p>
                <p>Unit price: ${price}</p>
                <p>Set Price: ${price * cartQuantity}</p>

              </Card>
            )
          })}
        </div>
      )}
    </div>
  </div>;
}
