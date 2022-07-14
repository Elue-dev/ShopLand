import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/card/Card";
import Loader from "../../components/loader/Loader";
import useFetchCollection from "../../hooks/useFetchCollection";
import { selectUserID } from "../../redux/slice/authSlice";
import { selectOrderHistory, STORE_ORDERS } from "../../redux/slice/orderSlice";
import styles from "./notifications.module.scss";

export default function Notifications() {
  const { data, loading } = useFetchCollection("Orders");
  const notifs = useSelector(selectOrderHistory);
  const dispatch = useDispatch();
  const userID = useSelector(selectUserID);

  useEffect(() => {
    dispatch(STORE_ORDERS(data));
  }, [dispatch, data]);

  const filteredNotifs = notifs.filter((notif) => notif.userID === userID);
  return (
    <div className={`container ${styles.notif}`}>
      <h1>Notifications on the status of your order</h1>
      <br />
      {loading ? (
        <Loader />
      ) : (
        <div>
          {filteredNotifs.length === 0 ? (
            <div>
              <h2>
                Sorry, You have no orders, hence no notifications on order
                status.
              </h2>
            </div>
          ) : (
            <>
              {filteredNotifs === "Empty" ? (
                <>
                  <h2>
                    Your order status is at the <i>'Placed Order'</i>status,
                    keep checking for changes
                  </h2>
                </>
              ) : (
                <div>
                  {filteredNotifs.map((notif) => {
                    const { id, orderNotification, orderDate, userEmail } =
                      notif;
                    return (
                      <div key={id}>
                        <Card cardClass={styles.card}>
                          <div className={styles.details}>
                            {orderNotification ===
                            "Your order has been changed to the status of DELIEVERED!" ? (
                              <h2 style={{ color: "green" }}>
                                <i>{orderNotification}</i>
                              </h2>
                            ) : (
                              <h2 style={{ color: "#c07d53" }}>
                                <i>{orderNotification}</i>
                              </h2>
                            )}

                            <h2>
                              For your order with the Order ID: <b>{id}</b>
                            </h2>
                            <h2>
                              Placed on: <b>{orderDate}</b>
                            </h2>
                            <h2>
                              By: <b>{userEmail}</b>
                            </h2>
                          </div>
                        </Card>
                        <br />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
