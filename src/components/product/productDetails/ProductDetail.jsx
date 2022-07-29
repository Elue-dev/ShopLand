import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import spinnerImg from "../../../assets/spinner.jpg";
import StarRatings from "react-star-ratings";
import { BsInfoCircle, BsFillCheckCircleFill } from "react-icons/bs";
import { ImEyePlus } from "react-icons/im";
import { TiCancel } from "react-icons/ti";
import { MdError } from "react-icons/md";
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
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState(false);
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
    if (product?.Availability === "Out of stock") {
      setError(true);
      setTimeout(() =>setError(false), 10000)
      return;
    }
    dispatch(ADD_TO_CART(product));
    navigate("/cart");
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
              <p
                className={
                  product.Availability === "Out of stock"
                    ? styles["out-of-stock"]
                    : styles["in-stock"]
                }
              >
                <b className={styles.flex}>
                  {product.Availability === "Out of stock" ? (
                    <TiCancel size={20} />
                  ) : (
                    <BsFillCheckCircleFill />
                  )}
                  &nbsp; {product.Availability}
                </b>
              </p>
              {error && (
                <p className={`${styles.flex} ${styles.error}`}>
                  <MdError />
                  &nbsp;Sorry, this product is currently out of stock, but you can save for
                  later.
                </p>
              )}
              <div className={styles["cart-buttons"]}>
                <button
                  className={
                    disable
                      ? `--btn --btn-danger ${styles.disable}`
                      : "--btn --btn-danger "
                  }
                  onClick={() => addToCart(product)}
                  disabled={disable}
                >
                  ADD TO CART
                </button>
                {savedItems.some((s) => s.id === product.id) ? (
                  <button
                    className={`--btn --btn-danger ${styles.later}`}
                    onClick={() => removeFromSaved(product)}
                    disabled
                    style={{ opacity: ".3", cursor: "not-allowed" }}
                  >
                    <BsFillCheckCircleFill />
                    &nbsp; PRODUCT SAVED
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
