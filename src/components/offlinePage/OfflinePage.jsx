import React from "react";
import { RiWifiOffLine } from "react-icons/ri";
import styles from "./offlinePage.module.scss";

export default function OfflinePage() {
  return (
    <div className={styles.offline}>
      <RiWifiOffLine className={styles.icon} />
      <h1>YOU ARE OFFLINE.</h1>
      <p><b>You would be able to access Shop<span>Land</span> once your network connection is restored.</b></p>
    </div>
  );
}
