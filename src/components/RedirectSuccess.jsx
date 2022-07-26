import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectSuccess() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    "Permission denied, this page's contents will only be rendered after a purchase."
  );

  window.setTimeout(() => {
    setMessage("Redirecting to home...");
  }, 8000);

  useEffect(() => {
    window.setTimeout(() => {
      navigate("/");
    }, 12000);
  }, []);

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <h2>{message}</h2>
    </div>
  );
}
