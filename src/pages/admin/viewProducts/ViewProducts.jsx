import { database } from "../../../firebase/firebase";
import Loader from "../../../components/loader/Loader";
import { toast } from "react-toastify";
import styles from "./viewProducts.module.scss";
import {
  doc,
  deleteDoc,
} from "firebase/firestore";
import { storage } from "../../../firebase/firebase";
import { ref, deleteObject } from "firebase/storage";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Notiflix from "notiflix";
import { useDispatch, useSelector } from "react-redux";
import { selectProducts, STORE_PRODUCTS } from "../../../redux/slice/productSlice";
import useFetchcollection from "../../../hooks/useFetchCollection";
import { useEffect } from "react";

export default function ViewProducts() {
  const { data, loading} = useFetchcollection('Products')
  const dispatch = useDispatch();

  const products = useSelector(selectProducts)

  useEffect(() => {
    dispatch(STORE_PRODUCTS({
      products: data
    }))
  }, [dispatch, data])

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
        titleColor: "red",
        okButtonBackground: "red",
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
        {products.length === 0 ? (
          <p>No Products Found.</p>
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
              {products?.map((product, index) => {
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
      </div>
    </>
  );
}
