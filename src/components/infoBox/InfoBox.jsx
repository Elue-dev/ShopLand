import React from "react";
import Card from "../card/Card";
import styles from "./infoBox.module.scss";

export default function InfoBox({ cardClass, title, count, icon }) {
  return (
    <div className={styles["info-box"]}>
      <Card cardClass={cardClass}>
        <h4>{title}</h4>
        <span>
          <h3>{count}</h3>
          {icon}
        </span>
      </Card>
    </div>
  );
}
