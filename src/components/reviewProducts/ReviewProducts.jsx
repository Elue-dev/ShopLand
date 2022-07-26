import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectUserID } from "../../redux/slice/authSlice";
import Card from "../card/Card";
import styles from "./reviewProducts.module.scss";
import StarsRating from "react-star-rate";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { toast } from "react-toastify";
import useFetchDocument from "../../hooks/useFetchDocuments";
import spinnerImg from "../../assets/spinner.jpg";
import { useAuth } from "../../contexts/authContext";

const ReviewProducts = () => {
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const { document } = useFetchDocument("Products", id);
  const userID = useSelector(selectUserID);
  const navigate = useNavigate();

  useEffect(() => {
    setProduct(document);
  }, [document]);

  const submitReview = async (e) => {
    e.preventDefault();

    if (rate === 0) {
      setError("Please give a star rating, star rating cannot be blank.");
      window.setTimeout(() => setError(""), 5000);
      return;
    }

    if (review === '') {
      setError("You left the review blank, please enter something before submitting.");
      window.setTimeout(() => setError(""), 5000);
      return;
    }

    const today = new Date();
    const date = today.toDateString();
    const reviewConfig = {
      userID,
      name: user.displayName,
      productID: id,
      rate,
      review,
      reviewDate: date,
      createdAt: Timestamp.now().toDate(),
    };
    try {
      await addDoc(collection(database, "Reviews"), reviewConfig);
      toast.success("Your review has been submitted, thank you.");
      setRate(0);
      setReview("");
      navigate("/order-history");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section>
      <div className={`container ${styles.review}`}>
        <h2>Rate This Product</h2>
        {product === null ? (
          <img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} />
        ) : (
          <>
            <p>
              <b>Product name:</b> {product.name}
            </p>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "100px" }}
            />
          </>
        )}

        <Card cardClass={styles.card}>
          <form onSubmit={(e) => submitReview(e)}>
            {error && <p className="alert error">{error}</p>}
            <label>Rating:</label>
            <StarsRating
              value={rate}
              onChange={(rate) => {
                setRate(rate);
              }}
            />
            <label>Review</label>
            <textarea
              value={review}
              // required
              onChange={(e) => setReview(e.target.value)}
              cols="30"
              rows="10"
            ></textarea>
            <button type="submit" className="--btn --btn-primary --btn-block">
              Submit Review
            </button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default ReviewProducts;
