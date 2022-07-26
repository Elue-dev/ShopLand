import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchDocuments from "../../hooks/useFetchDocuments";
import spinnerImg from "../../assets/spinner.jpg";
import styles from "./orderDetails.module.scss";
import useFetchCollection from "../../hooks/useFetchCollection";
import Loader from "../../components/loader/Loader";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const { document } = useFetchDocuments("Orders", id);
  const { data } = useFetchCollection("Shipping-Address");
  const filteredAddress = data.find(
    (address) => address.userEmail === order?.userEmail
  );

  useEffect(() => {
    setOrder(document);
  }, [document]);

  if (!order || !filteredAddress) {
    return <Loader />;
  }

  return (
    <section>
      <div className={`container ${styles.table} ${styles.sec}`}>
        <div>
          <Link to="/order-history">&larr; Back To Orders</Link>
        </div>
        <br />
        <>
          <h3 className={styles.heading}>Order Information</h3>
          <p>
            <b>Order ID:</b> {order.id}
          </p>
          <p>
            <b>Order Amount:</b> NGN{" "}
            {new Intl.NumberFormat().format(order.orderAmount)}
          </p>
          <p>
            <b>Order Status:</b> {order.orderStatus}{" "}
            {order.orderStatus === "Delivered"
              ? ""
              : "(This could change at anytime, check here or your inbox for changes to this status)"}
          </p>
          <br />
          {filteredAddress && (
            <>
              <h3 className={styles.heading}>Address Information</h3>
              <p>
                <b>Name: </b>
                {filteredAddress.name}
              </p>
              <p>
                <b>Phone Number: </b>
                {filteredAddress.phone}
              </p>
              <p>
                <b>Address 1: </b>
                {filteredAddress.line1}
              </p>
              <p>
                <b>Address 2: </b>
                {filteredAddress.line2}
              </p>
              <p>
                <b>Country: </b>
                {filteredAddress.country}
              </p>
              <p>
                <b>State: </b>
                {filteredAddress.state}
              </p>
              <p>
                <b>Time Of Order: </b>
                {filteredAddress.time}
              </p>
              <p>
                <b>Date Of Order: </b>
                {filteredAddress.date}
              </p>
            </>
          )}
          <br />
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {order.cartItems.map((cart, index) => {
                const { id, name, price, imageUrl, cartQuantity } = cart;
                return (
                  <tr key={id}>
                    <td>
                      <b>{index + 1}</b>
                    </td>
                    <td>
                      <p>
                        <b>{name}</b>
                      </p>
                      <img
                        src={imageUrl}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>NGN {new Intl.NumberFormat().format(price)}</td>
                    <td>{cartQuantity}</td>
                    <td>
                      {new Intl.NumberFormat().format(price * cartQuantity)}
                    </td>
                    <td className={styles.icons}>
                      <Link to={`/review-product/${id}`}>
                        <button className="--btn --btn-primary">
                          Review Product
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      </div>
    </section>
  );
};

export default OrderDetails;
