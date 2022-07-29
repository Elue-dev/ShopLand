import { useEffect, useState } from "react";
import { BsFillGridFill } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_BY_SEARCH,
  selectFilteredProducts,
  SORT_PRODUCTS,
} from "../../../redux/slice/filterSlice";
import Pagination from "../../pagination/Pagination";
import Search from "../../search/Search";
import ProductItem from "../productItem/ProductItem";
import styles from "./productList.module.scss";

export default function ProductList({ products }) {
  const [grid, setGrid] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const dispatch = useDispatch();
  const filteredProducts = useSelector(selectFilteredProducts);

  // ========pagination==========
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  //get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // ================================
  useEffect(() => {
    dispatch(
      FILTER_BY_SEARCH({
        products,
        search,
      })
    );
  }, [dispatch, products, search]);

  useEffect(() => {
    dispatch(
      SORT_PRODUCTS({
        products,
        sort,
      })
    );
  }, [dispatch, products, sort]);

  return (
    <div className={styles["product-list"]} id="product">
      <div className={styles.top}>
        <div className={styles.icons}>
          <BsFillGridFill
            size={22}
            color="#c07d53"
            onClick={() => setGrid(true)}
          />
          <FaListAlt size={24} color="#111" onClick={() => setGrid(false)} />
          <p>
            <b>
              {filteredProducts.length === 1
                ? "1 Product Found"
                : `${filteredProducts.length} Products Found`}
            </b>
          </p>
        </div>
        <div>
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={styles.sort}>
          <label>Sort by:</label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <option value="latest">Latest</option>
            <option value="lowest-price">Lowest Price</option>
            <option value="highest-price">Highest Price</option>
            <option value="In-stock">In-stock</option>
            <option value="Out of stock">Out of stock</option>
            <option value="a-z">A - Z (alphabet. order)</option>
            <option value="z-a">Z - A (alphabet. order)</option>
          </select>
        </div>
      </div>
      {search && (
        <p
          style={{ textAlign: "center", margin: "2rem 0", fontSize: "1.9rem" }}
        >
          <b>
            Products including ' <i style={{ color: "#c07d53" }}>{search}</i> '
          </b>
        </p>
      )}
      <div className={grid ? `${styles.grid}` : `${styles.list}`}>
        {filteredProducts.length === 0 ? (
          <h2>
            <b>No Product(s) Found.</b>
          </h2>
        ) : (
          <>
            {currentProducts.map((product) => (
              <div key={product.id}>
                <ProductItem {...product} grid={grid} product={product} />
              </div>
            ))}
          </>
        )}
      </div>
      <Pagination
        productsPerPage={productsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalProducts={filteredProducts.length}
      />
    </div>
  );
}
