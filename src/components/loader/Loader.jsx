import { useEffect, useState } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import "./loader.scss";

export default function Loader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <div className="loader">
      {loading && (
        <BounceLoader color={"#c07d53"} loading={loading} size={50} />
      )}
    </div>
  );
}
