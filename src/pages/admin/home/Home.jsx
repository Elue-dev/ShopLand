import React, { useEffect } from "react";
import InfoBox from "../../../components/infoBox/InfoBox";
import spinnerImg from "../../../assets/spinner.jpg";
import styles from "./home.module.scss";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProducts,
  STORE_PRODUCTS,
} from "../../../redux/slice/productSlice";
import {
  CALCULATE_TOTAL_ORDER_AMOUNTS,
  selectOrderHistory,
  selectTotalOrderAmount,
  STORE_ORDERS,
} from "../../../redux/slice/orderSlice";
import useFetchCollection from "../../../hooks/useFetchCollection";
import Chart from "../../../components/chart/Chart";

//Icons
const earningIcon = <AiFillDollarCircle size={30} color="#c07d53" />;
const productIcon = <BsCart4 size={30} color="#000" />;
const ordersIcon = <FaCartArrowDown size={30} color="#3c4448" />;

const Home = () => {
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrderHistory);
  const totalOrderAmount = useSelector(selectTotalOrderAmount);

  //doing this to save the info to redux and fetch it here from there directly, cause fetching it from frontend means if we refresh the page, we loose the data.
  const dbProducts = useFetchCollection("Products");
  const { data } = useFetchCollection("Orders");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: dbProducts.data,
      })
    );

    dispatch(STORE_ORDERS(data));

    dispatch(CALCULATE_TOTAL_ORDER_AMOUNTS());
  }, [dispatch, data, dbProducts]);

  return (
    <div className={styles.home}>
      <h2>Dashboard</h2>
      <div className={styles["info-box"]}>
        <InfoBox
          cardClass={`${styles.card} ${styles.card1}`}
          title={"Earnings"}
          count={
            totalOrderAmount === 0 ? (
              <img
                src={spinnerImg}
                alt="loading"
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              `NGN ${totalOrderAmount}`
            )
          }
          icon={earningIcon}
        />
        <InfoBox
          cardClass={`${styles.card} ${styles.card2}`}
          title={"Products"}
          count={
            products.length === 0 ? (
              <img
                src={spinnerImg}
                alt="loading"
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              products.length
            )
          }
          icon={productIcon}
        />
        <InfoBox
          cardClass={`${styles.card} ${styles.card3}`}
          title={"Orders"}
          count={
            orders.length === 0 ? (
              <img
                src={spinnerImg}
                alt="loading"
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              orders.length
            )
          }
          icon={ordersIcon}
        />
      </div>
      <div>
        <Chart />
      </div>
    </div>
  );
};

export default Home;
