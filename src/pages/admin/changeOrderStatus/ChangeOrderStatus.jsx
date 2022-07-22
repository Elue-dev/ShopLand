import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { database } from "../../../firebase/firebase";
import Card from "../../../components/card/Card";
import Loader from "../../../components/loader/Loader";
import styles from "./changeOrderStatus.module.scss";
import { BsInfoCircle } from "react-icons/bs";

const ChangeOrderStatus = ({ order, id }) => {
  const [status, setStatus] = useState("");
  const [notif, setNotif] = useState("");
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (order !== null && order.orderNotification !== null) {
      if (
        order.orderNotification ===
          "Your order has been changed to the status of DELIEVERED!" ||
        order.orderStatus === "Delivered"
      ) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    }
  }, [order]);

  const editOrder = (e, id) => {
    e.preventDefault();
    setIsLoading(true);

    const orderConfig = {
      userID: order.userID,
      userEmail: order.userEmail,
      orderDate: order.orderDate,
      orderTime: order.orderTime,
      orderAmount: order.orderAmount,
      orderStatus: status,
      orderNotification: notif,
      cartItems: order.cartItems,
      createdAt: order.createdAt,
      editedAt: Timestamp.now().toDate(),
    };
    try {
      setDoc(doc(database, "Orders", id), orderConfig);

      setIsLoading(false);
      toast.success("Order status & notification changed successfully");
      navigate("/admin/orders");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className={styles.status}>
        <Card cardClass={styles.card}>
          {disable ? (
            <p className={styles["order-alert"]}>
              <BsInfoCircle size={13} />
              &nbsp; Product has been delievered, so you can't change it's
              status.
            </p>
          ) : null}
          {!disable ? (
            <p className={styles["order-alert"]}>
              <BsInfoCircle size={13} />
              &nbsp; Only change status and notification to Delievered when you
              have confirmed that the user has gotten this product.
            </p>
          ) : null}
          <h4>Update Status</h4>
          <form onSubmit={(e) => editOrder(e, id)}>
            <span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                disabled={disable}
              >
                <option value="" disabled>
                  -- Choose one --
                </option>
                <option value="Order Placed...">Order Placed...</option>
                <option value="Processing...">Processing...</option>
                <option value="Shipped...">Shipped...</option>
                <option value="Delivered">Delivered</option>
              </select>
            </span>
            <br />

            <span>
              <h4>
                Update Notification
                <br /> (Must correspond with status)
              </h4>
              <select
                value={notif}
                onChange={(e) => setNotif(e.target.value)}
                required
                disabled={disable}
              >
                <option value="" disabled>
                  -- Choose one --
                </option>
                <option value="Your order has been Placed.....">
                  Your order has been Placed.....
                </option>
                <option value="Your order has been changed to the status of PROCESSING...">
                  Your order has been changed to the status of PROCESSING...
                </option>
                <option value="Your order has been changed to the status of SHIPPED...">
                  Your order has been changed to the status of SHIPPED...
                </option>
                <option value="Your order has been changed to the status of DELIEVERED!">
                  Your order has been changed to the status of DELIEVERED!
                </option>
              </select>
            </span>
            <span>
              <button
                type="submit"
                className="--btn --btn-primary"
                disabled={disable}
                style={{ opacity: disable ? ".6" : "" }}
              >
                Update Status & Notification
              </button>
            </span>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ChangeOrderStatus;
