import React, { useEffect, useState } from "react";
import { FaCogs } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import useFetchcollection from "../../hooks/useFetchCollection";
import {
  GET_PRICE_RANGE,
  selectProducts,
  STORE_PRODUCTS,
} from "../../redux/slice/productSlice";
import styles from "./product.module.scss";
import ProductFilter from "./productFilter/ProductFilter";
import ProductList from "./productList/ProductList";
import Spinner from "../../assets/spinner.jpg";

export default function Product() {
  const { data, loading } = useFetchcollection("Products");
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      })
    );
    dispatch(
      GET_PRICE_RANGE({
        products: data,
      })
    );
  }, [dispatch, data]);

  return (
    <section className={styles.section}>
      <h2 style={{ textAlign: "center", padding:'3rem 0', color: '#c07d53' }}>Explore our products</h2>
      <div className={`container ${styles.product}`}>
        <aside
          className={
            showFilter ? `${styles.filter} ${styles.show}` : `${styles.filter}`
          }
        >
          {loading ? null : (
            <ProductFilter
              showFilter={showFilter}
              setShowFilter={setShowFilter}
            />
          )}
        </aside>
        <div className={styles.content}>
          {loading ? (
            <img
              src={Spinner}
              alt="spinner"
              style={{ width: "50px" }}
              className="--center-all"
            />
          ) : (
            <ProductList products={products} />
          )}
          <div
            className={styles.icon}
            onClick={() => setShowFilter(!showFilter)}
          >
            &nbsp;{" "}
            {products.length ? (
              <>
                <FaCogs size={20} color="#c07d53" />
                <p>
                  <b>{showFilter ? "Hide Filters" : "Show Filters"}</b>
                </p>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
