import { useEffect, useState } from "react";
import { database } from "../../../firebase/firebase";
import Loader from "../../../components/loader/Loader";
import { toast } from "react-toastify";
import styles from "./viewProducts.module.scss";
import { doc, deleteDoc } from "firebase/firestore";
import { storage } from "../../../firebase/firebase";
import { ref, deleteObject } from "firebase/storage";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Notiflix from "notiflix";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProducts,
  STORE_PRODUCTS,
} from "../../../redux/slice/productSlice";
import useFetchcollection from "../../../hooks/useFetchCollection";
import {
  FILTER_BY_SEARCH,
  selectFilteredProducts,
} from "../../../redux/slice/filterSlice";
import Search from "../../../components/search/Search";
import Pagination from "../../../components/pagination/Pagination";

export default function ViewProducts() {
  const [search, setSearch] = useState("");
  const { data, loading } = useFetchcollection("Products");
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const filteredProducts = useSelector(selectFilteredProducts);

  // ========pagination==========
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  //get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      })
    );
  }, [dispatch, data]);

  useEffect(() => {
    dispatch(
      FILTER_BY_SEARCH({
        products,
        search,
      })
    );
  }, [dispatch, products, search]);

  const confirmDelete = (id, imageUrl, name) => {
    Notiflix.Confirm.show(
      "Delete Product",
      `Are you sure you want to delete ${name}?`,
      "DELETE",
      "CANCEL",
      function okCb() {
        deleteProduct(id, imageUrl);
        toast.success(`You have deleted ${name}`);
      },
      function cancelCb() {},
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "#c07d53",
        okButtonBackground: "#c07d53",
        cssAnimationStyle: "zoom",
      }
    );
  };

  const deleteProduct = async (id, imageUrl) => {
    try {
      await deleteDoc(doc(database, "Products", id));
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef)
        .then(() => {
          "";
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className={styles.table}>
        <h2>All Products</h2>
        <div className={styles.search}>
          <p>
            <b>{currentProducts.length}</b> Product(s) Found
          </p>
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <p
              style={{
                textAlign: "center",
                margin: "2rem 0",
                fontSize: "1.9rem",
              }}
            >
              <b>
                Products including '{" "}
                <i style={{ color: "#ff847c" }}>{search}</i> '
              </b>
            </p>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <h2>
            <b>No Product(s) Found.</b>
          </h2>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Image</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts?.map((product, index) => {
                const { id, name, price, imageUrl, category } = product;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={imageUrl}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{name}</td>
                    <td>{category}</td>
                    <td>${price}</td>
                    <td className={styles.icons}>
                      <Link to={`/admin/add-product/${id}`}>
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp;
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => confirmDelete(id, imageUrl, name)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <Pagination
          productsPerPage={productsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalProducts={filteredProducts.length}
        />
      </div>
    </>
  );
}
