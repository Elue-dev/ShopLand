import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "./chart.module.scss";
import Card from "../card/Card";
import { selectOrderHistory } from "../../redux/slice/orderSlice";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
};

export default function Chart() {
  const orders = useSelector(selectOrderHistory);

  //create a new array of the order status
  const ordersArray = [];
  orders.map((item) => {
    const { orderStatus } = item;
    ordersArray.push(orderStatus);
  });

  //get the count from new array created cuz as you know the number varies, e.g processing is 2, delievered is 2 etc...
  const getOrderStatusCount = (array, value) => {
    return array.filter((n) => n === value).length;
  };

  const [q1, q2, q3, q4] = [
    "Order Placed...",
    "Processing...",
    "Shipped...",
    "Delivered",
  ];

  const placed = getOrderStatusCount(ordersArray, q1);
  const processing = getOrderStatusCount(ordersArray, q2);
  const shipped = getOrderStatusCount(ordersArray, q3);
  const delievered = getOrderStatusCount(ordersArray, q4);

  const data = {
    labels: ["Placed Orders", "Processing", "Shipped...", "Delivered"],
    datasets: [
      {
        label: "Order Count",
        data: [placed, processing, shipped, delievered],
        backgroundColor: "#c07d53",
      },
    ],
  };

  return (
    <div className={styles.chart}>
      <Card cardClass={styles.card}>
        <h3><b>Order status chart</b></h3>
        <Bar options={options} data={data} />;
      </Card>
    </div>
  );
}
