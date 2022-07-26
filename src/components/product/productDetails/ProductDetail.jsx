import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import spinnerImg from "../../../assets/spinner.jpg";
import StarRatings from "react-star-ratings";
import { BsInfoCircle } from "react-icons/bs";
import { ImEyePlus } from "react-icons/im";
import styles from "./productDetails.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
  REMOVE_FROM_SAVED,
  SAVE_FOR_LATER,
  selectSavedItems,
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
  const savedItems = useSelector(selectSavedItems);
  const navigate = useNavigate();

  //the fetch return ALL the reviews, but we dont want to display all, only the specfic one for a specific product.
  const filteredReviews = data.filter((review) => review.productID === id);

  useEffect(() => {
    setProduct(document);
  }, [document]);

  const addToCart = (product) => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  const addToSaved = (product) => {
    dispatch(SAVE_FOR_LATER(product));
  };

  const removeFromSaved = (product) => {
    dispatch(REMOVE_FROM_SAVED(product));
  };

  return (
    <section>
      <div className={`container ${styles.product}`}>
        <div>
          <p onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
            &larr; Go back
          </p>
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
              <p className={styles.price}>
                {" "}
                NGN {new Intl.NumberFormat().format(product.price)}
              </p>
              <p>{product.description}</p>
              <p>
                <b>SKU:</b> {product.id}
              </p>
              <p>
                <b>Brand:</b> {product.brand}
              </p>
              <div className={styles["cart-buttons"]}>
                <button
                  className="--btn --btn-danger"
                  onClick={() => addToCart(product)}
                >
                  ADD TO CART
                </button>
                {savedItems.some((s) => s.id === product.id) ? (
                  <button
                    className={`--btn --btn-danger ${styles.later}`}
                    onClick={() => removeFromSaved(product)}
                  >
                    REMOVE FROM SAVED
                  </button>
                ) : (
                  <button
                    className={`--btn --btn-danger ${styles.later}`}
                    onClick={() => addToSaved(product)}
                  >
                    SAVE FOR LATER
                  </button>
                )}
              </div>
              <Link to="/cart">
                <ImEyePlus />
                &nbsp; View cart
              </Link>
            </div>
          </div>
        )}
        {product && (
          <Card cardClass={styles.card}>
            <h3>
              {filteredReviews.length === 1 ? "Review" : "Reviews"}
              <span style={{ fontSize: "1.6rem" }}>
                &nbsp;({filteredReviews.length} total)
              </span>
            </h3>
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
                          <br />
                          <StarRatings
                            rating={rate}
                            starDimension="30px"
                            starRatedColor="gold"
                            starSpacing="3px"
                          />
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
