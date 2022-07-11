import { Link } from "react-router-dom";
import styles from "./error404.module.scss";

export default function Error404() {
    return (
        <div className={styles["not-found"]}>
          <div>
            <h2>SORRY</h2>
            <h3>we couldnt find that page.</h3>
            <br />
            <button className="--btn">
              <Link to="/">&larr; Go to ShopLand's Home Page</Link>
            </button>
          </div>
        </div>
      );
}
