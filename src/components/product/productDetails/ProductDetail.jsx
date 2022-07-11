import React, { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { database } from "../../../firebase/firebase";
import spinnerImg from "../../../assets/spinner.jpg";
import StarsRating from "react-star-rate";
import styles from "./productDetails.module.scss";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_TO_CART,
  DECREASE_CART,
  CALCULATE_TOTAL_QUANTITY,
  selectCartItems,
} from "../../../redux/slice/cartSlice";
import useFetchDocuments from "../../../hooks/useFetchDocuments";
import useFetchCollection from "../../../hooks/useFetchCollection";
import Card from "../../card/Card";
import { useAuth } from "../../../contexts/authContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { document } = useFetchDocuments("Products", id);
  const { data } = useFetchCollection("Reviews");

  //the fetch return ALL the reviews, but we dont want to display all, only the specfic one for a specific product.
  const filteredReviews = data.filter((review) => review.productID === id);

  const cartItems = useSelector(selectCartItems); //all cart items in redux
  console.log(cartItems);
  // const cart = cartItems.find((item) => item.id === id); //get info about particular product
  // console.log(cart.carytQuantity)

  // const isCartAdded = () => {
  //   //whether product has been added to the cart or  not
  //   cartItems.findIndex((item) => {
  //     return item.id === id;
  //   });
  // };

  useEffect(() => {
    setProduct(document);
  }, [document]);

  const addTocart = (product) => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };
  const decreaseQty = (product) => {
    dispatch(DECREASE_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  return (
    <section>
      <div className={`container ${styles.product}`}>
        <h2>Product Details</h2>
        <div>
          <Link to="/#products">&larr; Back To Products</Link>
        </div>
        {product === null ? (
          <img src={spinnerImg} alt="loading" style={{ width: "80px" }} />
        ) : (
          <div className={styles.details}>
            <div className={styles.img}>
              <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className={styles.content}>
              <h3>{product.name}</h3>
              <p className={styles.price}>${product.price}</p>
              <p>{product.description}</p>
              <p>
                <b>SKU:</b> {product.id}
              </p>
              <p>
                <b>Brand:</b> {product.brand}
              </p>
              <div className={styles.count}>
                {/* {isCartAdded < 0 ? null : (
                  <>
                    <button
                      className="--btn"
                      onClick={() => decreaseQty(product)}
                    >
                      -
                    </button>
                    <p>
                      <b>1</b>
                    </p>
                    <button
                      className="--btn"
                      onClick={() => addTocart(product)}
                    >
                      +
                    </button>
                  </>
                )} */}
              </div>
              <button
                className="--btn --btn-danger"
                onClick={() => addTocart(product)}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        )}
        <Card cardClass={styles.card}>
          <h3>Product Review</h3>
          <div>
            {filteredReviews.length === 0 ? (
              <p>There are no reviews for this product yet</p>
            ) : (
              <>
                {filteredReviews.map((customerReview, index) => {
                  const { rate, review, reviewDate } = customerReview;
                  return (
                    <div key={index} className={styles.review}>
                      <StarsRating value={rate} />
                      <p>{review}</p>
                      <span>
                        <b>{reviewDate}</b>
                      </span>
                      <br />
                      <span>
                        <b>By: {user.displayName}</b>
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
