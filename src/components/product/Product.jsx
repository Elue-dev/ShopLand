import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import useFetchcollection from "../../hooks/useFetchCollection";
import { STORE_PRODUCTS } from "../../redux/slice/productSlice";
import styles from "./product.module.scss";
import ProductFilter from "./productFilter/ProductFilter";
import ProductList from "./productList/ProductList";
import Spinner from "../../assets/spinner.jpg";

export default function Product() {
  const { data, loading } = useFetchcollection("Products");

  const dispatch = useDispatch();

  // const products = useSelector(selectProducts)

  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      })
    );
  }, [dispatch, data]);

  return (
    <section>
      <div className={`container ${styles.product}`}>
        <aside className={styles.filter}>
          {loading ? null : <ProductFilter />}
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
            <ProductList products={data} />
          )}
        </div>
      </div>
    </section>
  );
}
