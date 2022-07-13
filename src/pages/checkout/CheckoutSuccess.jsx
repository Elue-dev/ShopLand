import { Link } from "react-router-dom";
import success from '../../assets/thanks.webp'
import styles from './checkoutDetails.module.scss'

export default function CheckoutSuccess() {
  return (
    <section>
      <div className={`container ${styles.success}`}>
        <h2>Your checkout was successful!</h2>
        <div>
          <img src={success} alt="successful order" />
        </div>
        <br />
        <button className="--btn --btn-primary">
          <Link to="/order-history" style={{color: '#fff'}}>View Order Status</Link>
        </button>
      </div>
    </section>
  );
}
