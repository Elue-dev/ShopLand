import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../firebase/firebase";
import { toast } from "react-toastify";

const useFetchCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCollection = () => {
      setLoading(true);
      try {
        const docRef = collection(database, collectionName);
        const q = query(docRef, orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
          let allData = [];
          snapshot.docs.forEach((doc) => {
            allData.push({ id: doc.id, ...doc.data() });
          });
          setData(allData);
          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
    };

    getCollection();
  }, [collectionName]);

  return { data, loading };
};

export default useFetchCollection;
