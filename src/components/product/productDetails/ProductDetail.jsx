import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import spinnerImg from "../../../assets/spinner.jpg";
import StarsRating from "react-star-rate";
import { BsInfoCircle } from "react-icons/bs";
import { ImEyePlus } from "react-icons/im";
import styles from "./productDetails.module.scss";
import { useDispatch } from "react-redux";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
} from "../../../redux/slice/cartSlice";
import useFetchDocuments from "../../../hooks/useFetchDocuments";
import useFetchCollection from "../../../hooks/useFetchCollection";
import Card from "../../card/Card";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const { document } = useFetchDocuments("Products", id);
  const { data } = useFetchCollection("Reviews");

  //the fetch return ALL the reviews, but we dont want to display all, only the specfic one for a specific product.
  const filteredReviews = data.filter((review) => review.productID === id);

  useEffect(() => {
    setProduct(document);
  }, [document]);

  const addTocart = (product) => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  return (
    <section>
      <div className={`container ${styles.product}`}>
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
              <p className={styles.price}><span className={styles.init}>${product.price}</span> ${product.price - 300}</p>
              <p>{product.description}</p>
              <p>
                <b>SKU:</b> {product.id}
              </p>
              <p>
                <b>Brand:</b> {product.brand}
              </p>
              <div className={styles.count}></div>
              <button
                className="--btn --btn-danger"
                onClick={() => addTocart(product)}
              >
                ADD TO CART
              </button>
              <Link to="/cart">
                <ImEyePlus />
                &nbsp; View cart
              </Link>
            </div>
          </div>
        )}
        {product && (
          <Card cardClass={styles.card}>
            <h3>Product Review(s)</h3>
            <div>
              {filteredReviews.length === 0 ? (
                <p>There are no reviews for this product yet</p>
              ) : (
                <>
                  {product &&
                    filteredReviews?.map((customerReview, index) => {
                      const { rate, review, reviewDate, name } = customerReview;

                      return (
                        <div key={index} className={styles.review}>
                          <StarsRating value={rate} />
                          <p>{review}</p>
                          <span>
                            <b>{reviewDate}</b>
                          </span>
                          <br />
                          <span>
                            <b>By: {name}</b>
                          </span>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          </Card>
        )}
        <br />
        {product ? (
          <span className={styles.add}>
            <BsInfoCircle size={13} />
            &nbsp; You can add reviews when you purchase a product.
          </span>
        ) : null}
      </div>
    </section>
  );
}
