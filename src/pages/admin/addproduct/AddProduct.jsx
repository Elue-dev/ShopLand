import { useEffect, useState } from "react";
import Card from "../../../components/card/Card";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { database, storage } from "../../../firebase/firebase";
import styles from "./addProduct.module.scss";
import { toast } from "react-toastify";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectProducts } from "../../../redux/slice/productSlice";

const categories = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Electronics" },
  { id: 3, name: "Fashion" },
  { id: 4, name: "Phone" },
];

const status = [
  { id: 1, name: "In-stock" },
  { id: 2, name: "Out of stock" },
];

const initialState = {
  name: "",
  imageUrl: "",
  price: "",
  category: "",
  availability: "",
  brand: "",
  count: "",
  description: "",
};

export default function AddProduct() {
  const { id } = useParams();
  const products = useSelector(selectProducts);
  const productEdit = products.find((item) => item.id === id);
  const [product, setProduct] = useState(() => {
    const newState = detectForm(id, { ...initialState }, productEdit);
    return newState;
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  function detectForm(id, arg1, arg2) {
    if (id === "ADD") {
      return arg1;
    } else {
      return arg2;
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `ShopLand/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        toast.error(
          "Image not added, only Elue Wisdom can add images to the database"
        );
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProduct({ ...product, imageUrl: downloadURL });
        });
      }
    );
  };

  const addProductToDatabase = (e) => {
    e.preventDefault();
    setLoading(true);

    if (product.count < 0) {
      setError("Product availabe cannot be less than 0");
      window.setTimeout(() => setError(""), 7000);
      setLoading(false);
      return;
    }

    if (product.availability === "In-stock" && product.count <= 0) {
      setError(
        "Since this product is in stock, number of product available cannot be 0"
      );
      window.setTimeout(() => setError(""), 10000);
      setLoading(false);
      return;
    }

    try {
      const collectionRef = collection(database, "Products");
      addDoc(collectionRef, {
        Availability: product.availability,
        name: product.name,
        imageUrl: product.imageUrl,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        count: Number(product.count),
        description: product.description,
        createdAt: Timestamp.now().toDate(),
      });
      setLoading(false);
      toast.info(
        "Product will be added (IF YOU ARE AN AUTHORIZED ADMIN, else it will fail to be added)",
        {
          pauseOnFocusLoss: false,
        }
      );
      setProduct({ ...initialState });
      setUploadProgress(0);
      navigate("/admin/all-products");
    } catch (error) {
      toast.error(
        "Product not added, only Elue Wisdom can add products to the database"
      );
      setLoading(false);
    }
  };

  const editProductInDatabase = (e) => {
    e.preventDefault();
    setLoading(true);

    if (product.imageUrl !== productEdit.imageUrl) {
      const storageRef = ref(storage, productEdit.imageUrl);
      deleteObject(storageRef);
    }

    if (product.count < 0) {
      setError("Product available cannot be less than 0");
      window.setTimeout(() => setError(""), 7000);
      setLoading(false);
      return;
    }

    if (product.availability === "Out of stock" && product.count > 0) {
      setError(
        "Since this product is out of stock, number of product available has to be 0"
      );
      window.setTimeout(() => setError(""), 7000);
      setLoading(false);
      return;
    }

    if (product.availability === "In-stock" && product.count <= 0) {
      setError(
        "Since this product is in stock, number of product available cannot be 0"
      );
      window.setTimeout(() => setError(""), 10000);
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(database, "Products", id);
      setDoc(docRef, {
        Availability: product.availability,
        name: product.name,
        imageUrl: product.imageUrl,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        count: Number(product.count),
        description: product.description,
        createdAt: productEdit.createdAt,
        editedAt: Timestamp.now().toDate(),
      });
      setLoading(false);
      toast.success("Product successfully edited");
      navigate("/admin/all-products");
    } catch (error) {
      toast.error(error.message, {
        pauseOnFocusLoss: false,
      });
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {products && (
        <div className={styles.product}>
          <h2>{detectForm(id, "Add New Product", "Edit Product")}</h2>
          <span>
            {detectForm(
              id,
              null,
              <p className={styles.warning}>
                Do not refresh this page, this would cause the data to be
                unavailable, but if for some reason it refreshes, leave this
                page and come back again and the data would be back, then you
                can proceed to edit this product.
              </p>
            )}
          </span>

          <Card cardClass={styles.card}>
            <label style={{ fontSize: "1.4rem", fontWeight: 500 }}>
              Product Name:
            </label>
            <form
              onSubmit={detectForm(
                id,
                addProductToDatabase,
                editProductInDatabase
              )}
            >
              <input
                type="text"
                placeholder="Product Name"
                value={product && product.name}
                name="name"
                onChange={(e) => handleInputChange(e)}
                required
              />
              <label>Product Image:</label>
              <Card cardClass={styles.group}>
                {uploadProgress === 0 ? null : (
                  <div className={styles.progress}>
                    <div
                      className={styles["progress-bar"]}
                      style={{ width: `${uploadProgress}%` }}
                    >
                      {uploadProgress < 100
                        ? `Uploading ${uploadProgress}%`
                        : `Upload Complete ${uploadProgress}%`}
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  placeholder="Product image"
                  name="image"
                  onChange={(e) => handleImageChange(e)}
                />
                {product && product.imageUrl === "" ? null : (
                  <input
                    type="text"
                    name="imageUrl"
                    disabled
                    required
                    placeholder="Image URL:"
                    value={product && product.imageUrl}
                  />
                )}
              </Card>
              <label>Product Price:</label>
              <input
                type="text"
                placeholder="Product Price"
                value={product && product.price}
                name="price"
                onChange={(e) => handleInputChange(e)}
                required
              />
              <label>Choose product category:</label>
              <select
                name="category"
                required
                value={product && product.category}
                onChange={(e) => handleInputChange(e)}
              >
                <option value="" disabled>
                  --choose product category--
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <label>Product Company/Brand:</label>
              <input
                type="text"
                placeholder="Product Brand (e.g Nike)"
                value={product && product.brand}
                name="brand"
                onChange={(e) => handleInputChange(e)}
                required
              />
              <label>Select availability status:</label>
              <select
                name="availability"
                required
                value={(product && product.availability) || ""}
                onChange={(e) => handleInputChange(e)}
              >
                <option value="" disabled>
                  --choose availability status--
                </option>
                {status.map((stat) => (
                  <option key={stat.id} value={stat.name}>
                    {stat.name}
                  </option>
                ))}
              </select>
              <label>Number of product available:</label>
              <input
                type="number"
                placeholder="The number available in stock (e.g 3)"
                value={product && product.count}
                name="count"
                onChange={(e) => handleInputChange(e)}
                required
              />
              {error && (
                <p
                  style={{
                    color: "red",
                    fontWeight: "700",
                    paddingBottom: "2rem",
                  }}
                >
                  {error}
                </p>
              )}
              <label>Product Description:</label>
              <textarea
                name="description"
                placeholder="Describe this product"
                value={product && product.description}
                onChange={(e) => handleInputChange(e)}
                rerquiredcols="30"
                rows="10"
                required
              />
              <button className="--btn --btn-primary --btn-block">
                {detectForm(id, "Save Product", "Edit Product")}
              </button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
