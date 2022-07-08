import { useState } from "react";
import { BsFillGridFill } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
import Search from "../../search/Search";
import ProductItem from "../productItem/ProductItem";
import styles from "./productList.module.scss";

export default function ProductList({ products }) {
  const [grid, setGrid] = useState(true);
  const [search, setSearch] = useState("");

  return (
    <div className={styles["product-list"]} id="product">
      <div className={styles.top}>
        <div className={styles.icons}>
          <BsFillGridFill
            size={22}
            color="#ff847c"
            onClick={() => setGrid(true)}
          />
          <FaListAlt size={24} color="#111" onClick={() => setGrid(false)} />
          <p>
            <b>{products.length}</b> Products found.
          </p>
        </div>
        <div>
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={styles.sort}>
          <label>Sort by:</label>
          <select>
            <option value="latest">Latest</option>
            <option value="lowest-price">Lowest Price</option>
            <option value="highest-price">Highest Price</option>
            <option value="a-z">A-Z (alphabet. order)</option>
            <option value="z-a">Z-A (alphabet. order)</option>
          </select>
        </div>
      </div>

      <div className={grid ? `${styles.grid}` : `${styles.list}`}>
        {products.length === 0 ? (
          <p>No Product Found.</p>
        ) : (
          <>
            {products.map((product) => (
              <div key={product.id}>
                <ProductItem {...product} grid={grid} product={product} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
