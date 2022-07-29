import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";
import Card from "../../../components/card/Card";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
} from "../../../redux/slice/cartSlice";
import styles from "./productItem.module.scss";

export default function ProductItem({
  product,
  grid,
  id,
  name,
  price,
  description,
  imageUrl,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState();

  const addToCart = (product) => {
    if (product?.Availability === "Out of stock") {
      setError(true);
      setTimeout(() => setError(false), 10000);
      return;
    }
    dispatch(ADD_TO_CART(product));
    navigate("/cart");
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  return (
    <Card cardClass={grid ? `${styles.grid}` : `${styles.list}`}>
      {product?.Availability === "Out of stock" && (
        <p className={styles["out-of-stock"]}>Out of stock</p>
      )}
      <div className={styles.img}>
        <Link to={`/product-details/${id}`}>
          <img src={imageUrl} alt={name} />
        </Link>
        <div className={styles.content}>
          <div className={styles.details}>
            <p>NGN {new Intl.NumberFormat().format(price)}</p>
            <h4>{name.substring(0, 21)}...</h4>
          </div>
          {!grid && (
            <p className={styles.desc}>{description.substring(0, 200)}...</p>
          )}
          {error && (
            <p className={`${styles.flex} ${styles.error}`}>
              <MdError />
              &nbsp;Out of stock
            </p>
          )}
          <button
            className="--btn --btn-danger"
            onClick={() => addToCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </Card>
  );
}
