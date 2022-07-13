import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../../../components/card/Card";
import { ADD_TO_CART, CALCULATE_TOTAL_QUANTITY } from "../../../redux/slice/cartSlice";
import styles from "./productItem.module.scss";

export default function ProductItem({product, grid, id, name, price, description, imageUrl}) {
  const dispatch = useDispatch()

  const addToCart = (product) => {
    dispatch(ADD_TO_CART(product))
    dispatch(CALCULATE_TOTAL_QUANTITY())
  }

  return (
    <Card cardClass={grid ? `${styles.grid}` : `${styles.list}`}>
      <div className={styles.img}>
        <Link to={`/product-details/${id}`}>
          <img src={imageUrl} alt={name} />
        </Link>
        <div className={styles.content}>
          <div className={styles.details}>
            <p>NGN {new Intl.NumberFormat().format(price)}</p>
            <h4>{name.substring(0,21)}...</h4>
          </div>
          {!grid && (
              <p className={styles.desc}>
                {description.substring(0,200)}...
              </p>
            )}
            <button className="--btn --btn-danger" onClick={() => addToCart(product)}>Add to cart</button>
        </div>
      </div>
    </Card>
  );
}
