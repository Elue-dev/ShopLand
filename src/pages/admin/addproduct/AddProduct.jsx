import { useState } from "react";
import Card from "../../../components/card/Card";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
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

const initialState = {
  name: "",
  imageUrl: "",
  price: "",
  category: "",
  brand: "",
  description: "",
};

export default function AddProduct() {
  const { id } = useParams();
  const products = useSelector(selectProducts);
  const productEdit = products.find((item) => item.id === id);
  const [product, setProduct] = useState(() => {
    const newState = detectForm(id, 
      {...initialState},
      productEdit
      )
      return newState
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
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
        toast.error(error.message);
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

    try {
      const collectionRef = collection(database, "Products");
      addDoc(collectionRef, {
        name: product.name,
        imageUrl: product.imageUrl,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        description: product.description,
        createdAt: Timestamp.now().toDate(),
      });
      setLoading(false);
      toast.success("Product uploaded successfully", {
        pauseOnFocusLoss: false,
      });
      setProduct({ ...initialState });
      setUploadProgress(0);
      navigate("/admin/all-products");
    } catch (error) {
      toast.error(error.message, {
        pauseOnFocusLoss: false,
      });
      setLoading(false);
    }
  };

  const editProductInDatabase = (e) => {
    e.preventDefault();
    setLoading(true);

    if (product.imageUrl !== productEdit.imageUrl) {
      const storageRef = ref(storage, productEdit.imageUrl)
      deleteObject(storageRef)
    }

    try {
      const docRef = doc(database, "Products", id);
      setDoc(docRef, {
        name: product.name,
        imageUrl: product.imageUrl,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        description: product.description,
        createdAt: productEdit.createdAt,
        editedAt: Timestamp.now().toDate()
      });
      setLoading(false)
      toast.success('Product successfully edited')
      navigate('/admin/all-products')
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
      <div className={styles.product}>
        <h2>{detectForm(id, "Add New Product", "Edit Product")}</h2>

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
              value={product.name}
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
              {product.imageUrl === "" ? null : (
                <input
                  type="text"
                  name="imageUrl"
                  disabled
                  required
                  placeholder="Image URL:"
                  value={product.imageUrl}
                />
              )}
            </Card>
            <label>Product Price:</label>
            <input
              type="number"
              placeholder="Product Price"
              value={product.price}
              name="price"
              onChange={(e) => handleInputChange(e)}
              required
            />
            <select
              name="category"
              required
              value={product.category}
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
              placeholder="Product Brand"
              value={product.brand}
              name="brand"
              onChange={(e) => handleInputChange(e)}
              required
            />
            <label>Product Description:</label>
            <textarea
              name="description"
              value={product.description}
              onChange={(e) => handleInputChange(e)}
              rerquiredcols="30"
              rows="10"
            />
            <button className="--btn --btn-primary">
              {detectForm(id, "Save Product", "Edit Product")}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
