import { useDispatch, useSelector } from "react-redux";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  REMOVE_FROM_SAVED,
  selectSavedItems,
} from "../../redux/slice/cartSlice";
import styles from "./saved.module.scss";

export default function Saved() {
  const savedItems = useSelector(selectSavedItems);
  const dispatch = useDispatch();

  const removeFromSaved = (product) => {
    dispatch(REMOVE_FROM_SAVED(product));
  };

  return (
    <section>
      <div className={` container ${styles.saved}`}>
        {savedItems.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.empty}>
              <MdOutlineFreeCancellation className={styles["basket-empty"]} />{" "}
              <br />
              <h2>You have not saved any products yet</h2>
              <button className="--btn --btn-block">
                <Link to="/#products">&larr; Start Exploring</Link>
              </button>
            </div>
          </div>
        ) : null}
        {savedItems.map((saved) => {
          return (
            <div key={saved.id} className={styles["saved-item"]}>
              <img src={saved.imageUrl} alt={saved.name} />
              <p>{saved.name}</p>
              <p>NGN {new Intl.NumberFormat().format(saved.price)}</p>
              <div className={styles.buttons}>
                <button className="--btn --btn-block">
                  <Link to={`/product-details/${saved.id}`}>See details</Link>
                </button>
                <button
                  className="--btn --btn-block"
                  onClick={() => removeFromSaved(saved)}
                >
                  Remove from saved
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
