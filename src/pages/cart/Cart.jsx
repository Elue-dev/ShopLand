import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectCartTotalAmounts,
  selectCartTotalQuantity,
  selectCartItems,
  ADD_TO_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  SAVE_URL,
} from "../../redux/slice/cartSlice";
import { FaTrashAlt } from "react-icons/fa";
import Card from "../../components/card/Card";
import styles from "./cart.module.scss";
import cartEmpty from "../../assets/cartempty.png";
import Notiflix from "notiflix";
import {
  selectEmail,
  selectIsLoggedIn,
  selectUserID,
  selectUserName,
} from "../../redux/slice/authSlice";
import useFetchCollection from "../../hooks/useFetchCollection";
import PaystackPop from "@paystack/inline-js";
import { toast } from "react-toastify";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { database } from "../../firebase/firebase";

export default function Cart() {
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmounts);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const { data } = useFetchCollection("Products");

  const totalAmount = useSelector(selectCartTotalAmounts);
  const customerEmail = useSelector(selectEmail);
  const name = useSelector(selectUserName);
  const userID = useSelector(selectUserID);
  const userEmail = useSelector(selectEmail);

  const increaseCart = (cart) => {
    dispatch(ADD_TO_CART(cart));
  };

  const decreaseCart = (cart) => {
    dispatch(DECREASE_CART(cart));
  };

  const removeFromCart = (cart) => {
    dispatch(REMOVE_FROM_CART(cart));
  };

  const confirmClearCart = () => {
    Notiflix.Confirm.show(
      "Clear Cart",
      "Are you sure you want to clear your cart?",
      "CLEAR",
      "CANCEL",
      function okCb() {
        dispatch(CLEAR_CART());
      },
      function cancelCb() {},
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "#c07d53",
        okButtonBackground: "#c07d53",
        cssAnimationStyle: "zoom",
      }
    );
  };

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
    dispatch(SAVE_URL(""));
  }, [dispatch, cartItems]);

  const url = window.location.href;
  
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
      orderNotification: 'Your order has beenPlaced.....',
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
          navigate("/checkout-success");
        },
        onCancel() {
          console.log("");
        },
      });
    };

    if (isLoggedIn) {
      // navigate("/checkout-details");
      initiatePayment();
    } else {
      dispatch(SAVE_URL(url));
      navigate("/login");
    }
  };

  return (
    <section className={styles.cart}>
      <div className={`container ${styles.table}`}>
        {cartItems.length ? <h2>Cart</h2> : null}
        {cartItems.length === 0 ? (
          <>
            <div className={styles["cart-empty"]}>
              <img src={cartEmpty} className={styles.image} />
              <div>
                <Link to="/#products" className={styles.link}>
                  &larr; Continue Shopping
                </Link>
              </div>
            </div>
            <br />
            <br />
            <>
              <h3>
                <b>Products you may like</b>
              </h3>
              <div className={styles.related}>
                {data?.slice(5, 11).map((product) => {
                  const { id, name, imageUrl, price } = product;
                  return (
                    <Link key={id} to={`/product-details/${id}`}>
                      <Card>
                        <div className={styles.details}>
                          <img src={imageUrl} alt={name} />
                          <p>{name}</p>
                          <p>NGN {new Intl.NumberFormat().format(price)}</p>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </>
          </>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cart, index) => {
                const { id, name, price, imageUrl, cartQuantity } = cart;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>
                      <p>
                        <b>{name}</b>
                      </p>
                      <img
                        src={imageUrl}
                        alt={name}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>NGN {new Intl.NumberFormat().format(price)}</td>
                    <td>
                      <div className={styles.count}>
                        <button
                          className="--btn"
                          onClick={() => decreaseCart(cart)}
                        >
                          -
                        </button>
                        <p>
                          <b>{cartQuantity}</b>
                        </p>
                        <button
                          className="--btn"
                          onClick={() => increaseCart(cart)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      {new Intl.NumberFormat().format(price * cartQuantity)}
                    </td>
                    <td className={styles.icons}>
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => removeFromCart(cart)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {cartItems.length ? (
          <div className={styles.summary}>
            <button className="--btn --btn-danger" onClick={confirmClearCart}>
              Clear Cart
            </button>
            <div className={styles.checkout}>
              <div>
                <Link to="/#products" style={{ fontWeight: "700" }}>
                  &larr; Continue Shopping
                </Link>
              </div>
              <br />
              <Card cardClass={styles.card}>
                <p>
                  <b>{`Total cart items(s): ${cartTotalQuantity}`}</b>
                </p>
                <br />
                <div className={styles.text}>
                  <h4>Subtotal:</h4>
                  <h3>NGN {new Intl.NumberFormat().format(cartTotalAmount)}</h3>
                </div>
                <p>Taxes and shippings calculated at checkout</p>
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
        ) : null}
      </div>
    </section>
  );
}
