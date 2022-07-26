import { useState } from "react";
import Card from "../../components/card/Card";
import { CountryDropdown } from "react-country-region-selector";
import styles from "./checkoutDetails.module.scss";
import { useDispatch } from "react-redux";
import {
  SAVE_SHIPPING_ADDRESS,
} from "../../redux/slice/checkoutSlice";
import { useNavigate } from "react-router-dom";

const initialAddressState = {
  name: "",
  line1: "",
  line2: "",
  state: "",
  city: "",
  postal_code: "",
  country: "",
  phone: "",
};

export default function CheckoutDetails() {
  const [shippingAddress, setShippingAddress] = useState({
    ...initialAddressState,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShipping = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(SAVE_SHIPPING_ADDRESS(shippingAddress));
    navigate("/checkout");
  };

  return (
    <section>
      <div className={`container ${styles.checkout}`}>
        <h2>Checkout Details</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <Card cardClass={styles.card}>
              <h3>Shipping Address</h3>
              <label>Reciepient Name:</label>
              <input
                type="text"
                placeholder="Reciepient Name"
                required
                name="name"
                value={shippingAddress.name}
                onChange={(e) => handleShipping(e)}
              />
              <label>Address line 1:</label>
              <input
                type="text"
                placeholder="Address line 1"
                required
                name="line1"
                value={shippingAddress.line1}
                onChange={(e) => handleShipping(e)}
              />
              <label>Address line 2:</label>
              <input
                type="text"
                placeholder="Address line 2"
                name="line2"
                value={shippingAddress.line2}
                onChange={(e) => handleShipping(e)}
              />
              <label>City:</label>
              <input
                type="text"
                placeholder="City"
                required
                name="city"
                value={shippingAddress.city}
                onChange={(e) => handleShipping(e)}
              />
              <label>State:</label>
              <input
                type="text"
                placeholder="State"
                required
                name="state"
                value={shippingAddress.state}
                onChange={(e) => handleShipping(e)}
              />
              <label>Postal code:</label>
              <input
                type="text"
                placeholder="Postal code"
                required
                name="postal_code"
                value={shippingAddress.postal_code}
                onChange={(e) => handleShipping(e)}
              />
              <label>Select Country:</label>
              <CountryDropdown
                className={styles.select}
                valueType="short"
                value={shippingAddress.country}
                onChange={(val) =>
                  handleShipping({ target: { name: "country", value: val } })
                }
              />
              <label>Phone:</label>
              <input
                type="number"
                placeholder="Phone"
                required
                name="phone"
                value={shippingAddress.phone}
                onChange={(e) => handleShipping(e)}
              />

              <button type="submit" className="--btn --btn-primary --btn-block">
               View order & checkout
              </button>
            </Card>
            <br />
            <br />
          </div>
        </form>
      </div>
    </section>
  );
}
