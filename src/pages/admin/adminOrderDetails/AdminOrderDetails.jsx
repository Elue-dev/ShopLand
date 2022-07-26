import React, { useEffect, useState } from "react";
import useFetchDocument from "../../../hooks/useFetchDocuments";
import styles from "./adminOrderDetails.module.scss";
import spinnerImg from "../../../assets/spinner.jpg";
import { Link, useParams } from "react-router-dom";
import ChangeOrderStatus from "../changeOrderStatus/ChangeOrderStatus";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddressHistory,
  STORE_ADDRESS,
} from "../../../redux/slice/orderSlice";
import useFetchCollection from "../../../hooks/useFetchCollection";
import { selectEmail, selectUserID } from "../../../redux/slice/authSlice";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const { document } = useFetchDocument("Orders", id);
  const dispatch = useDispatch();
  const { data } = useFetchCollection("Shipping-Address");
  console.log(data);
  const filteredAddress = data.find(
    (address) => address.userEmail === order?.userEmail
  );
  console.log(filteredAddress);

  useEffect(() => {
    dispatch(STORE_ADDRESS(data));
  }, [dispatch, data]);

  useEffect(() => {
    setOrder(document);
  }, [document]);

  return (
    <>
      <div className={styles.table}>
        <div>
          <Link to="/admin/orders">&larr; Back To Orders</Link>
        </div>
        <br />
        <h3 style={{ textDecoration: "underline" }}>Order Details</h3>
        {order === null ? (
          <img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} />
        ) : (
          <>
            <p>
              <b>Order ID:</b> &nbsp;{order.id}
            </p>
            <p>
              <b>Order Amount:</b> &nbsp;NGN{" "}
              {new Intl.NumberFormat().format(order.orderAmount)}
            </p>
            <p
              className={
                order.orderStatus === "Delivered"
                  ? `${styles.delievered}`
                  : `${styles.pending}`
              }
            >
              <b>Order Status:</b> &nbsp;{order.orderStatus}
              <br />
              <b>Order Notification:</b> {order.orderNotification}
              <br />
              <b>Order placed by:</b> &nbsp;{order.userEmail}
            </p>
            <br />
            <h3 style={{ textDecoration: "underline" }}>Customer Details</h3>
            {filteredAddress ? (
              <div>
                <p>
              <b>Name: </b>
              {filteredAddress.name}
            </p>
            <p>
              <b>Phone Number: </b>
              {filteredAddress.phone}
            </p>
            <p>
              <b>Name: </b>
              {filteredAddress.name}
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
              </div>
            ) : (
              <h4>This order was made before the address functionality was added.</h4>
            )}
            <br />
            <br />
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
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
                      <td>NGN {new Intl.NumberFormat().format(price)}</td>
                      <td>{cartQuantity}</td>
                      <td>
                        NGN{" "}
                        {new Intl.NumberFormat().format(price * cartQuantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
        {order && <ChangeOrderStatus order={order} id={id} />}
      </div>
    </>
  );
};

export default OrderDetails;
