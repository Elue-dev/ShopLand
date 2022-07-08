import React from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/card/Card";
import styles from "./productItem.module.scss";

export default function ProductItem({product, grid, name, price, description, imageUrl}) {
  return (
    <Card cardClass={grid ? `${styles.grid}` : `${styles.list}`}>
      <div className={styles.img}>
        <Link to="/">
          <img src={imageUrl} alt={name} />
        </Link>
        <div className={styles.content}>
          <div className={styles.details}>
            <p>${price}</p>
            <h4>{name.substring(0,21)}...</h4>
          </div>
          {!grid && (
              <p className={styles.desc}>
                {description.substring(0,200)}...
              </p>
            )}
            <button className="--btn --btn-danger">Add to cart</button>
        </div>
      </div>
    </Card>
  );
}
