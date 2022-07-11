import React, { useEffect, useState } from "react";
import useFetchDocument from "../../../hooks/useFetchDocuments";
import styles from "./adminOrderDetails.module.scss";
import spinnerImg from "../../../assets/spinner.jpg";
import { Link, useParams } from "react-router-dom";
import ChangeOrderStatus from "../changeOrderStatus/ChangeOrderStatus";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const { document } = useFetchDocument("Orders", id);
  console.log(order);

  useEffect(() => {
    setOrder(document);
  }, [document]);

  return (
    <>
      <div className={styles.table}>
        <h2>Order Details</h2>
        <div>
          <Link to="/admin/orders">&larr; Back To Orders</Link>
        </div>
        <br />
        {order === null ? (
          <img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} />
        ) : (
          <>
            <p>
              <b>Order ID:</b> &nbsp;{order.id}
            </p>
            <p>
              <b>Order Amount:</b> &nbsp;${order.orderAmount}
            </p>
            <p
              className={
                order.orderStatus === "Delivered"
                  ? `${styles.delievered}`
                  : `${styles.pending}`
              }
            >
              <b>Order Status:</b> &nbsp;{order.orderStatus}
            </p>
            <br />
            <p>
              <b style={{ textDecoration: "underline" }}>Shipping Address</b>
              <br />
              <b>Address:</b> {order.shippingAddress.line1},
              {order.shippingAddress.line2}, {order.shippingAddress.city}
              <br />
              <b>State:</b> &nbsp;{order.shippingAddress.state}
              <br />
              <b>Country:</b> &nbsp;{order.shippingAddress.country}
              <br />
              <b>Phone Number:</b> &nbsp;{order.shippingAddress.phone}
            </p>
            <br />
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
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
                      <td>{price}</td>
                      <td>{cartQuantity}</td>
                      <td>{(price * cartQuantity).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
        <ChangeOrderStatus order={order} id={id} />
      </div>
    </>
  );
};

export default OrderDetails;
