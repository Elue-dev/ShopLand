import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import useFetchCollection from "../../../hooks/useFetchCollection";
import {
  selectOrderHistory,
  STORE_ORDERS,
} from "../../../redux/slice/orderSlice";
import styles from "./orders.module.scss";

export default function Orders() {
  const { data, loading } = useFetchCollection("Orders");
  const orders = useSelector(selectOrderHistory);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(STORE_ORDERS(data));
  }, [dispatch, data]);

  const handleClick = (id) => {
    navigate(`/admin/order-details/${id}`);
  };

  //unlike the orders page for the user where we had to make sure the order history that is fetched belongs to the logged in user
  //we are just displaying ALL the orders in the database

  return (
    <section>
      <div className={`container ${styles.order}`}>
        <h2>All Orders</h2>
        <p>
          Open an order to <b>change order status</b>
        </p>
        <br />
        <>
          {loading && <Loader />}
          <div className={styles.table}>
            {orders.length === 0 ? (
              <p>No order found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Order Amount</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => {
                    const {
                      id,
                      orderDate,
                      orderTime,
                      orderAmount,
                      orderStatus,
                    } = order;
                    return (
                      <tr key={id} onClick={() => handleClick(id)}>
                        <td>{index + 1}</td>
                        <td>
                          {orderDate} at {orderTime}
                        </td>
                        <td>{id}</td>
                        <td>${orderAmount}</td>
                        <td>
                          <p
                            className={
                              orderStatus !== "Delivered"
                                ? `${styles.pending}`
                                : `${styles.delivered}`
                            }
                          >
                            {orderStatus}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      </div>
    </section>
  );
}
