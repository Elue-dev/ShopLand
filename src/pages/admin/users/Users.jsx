import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUsers, STORE_USERS } from "../../../redux/slice/authSlice";
import useFetchCollection from "../../../hooks/useFetchCollection";
import { doc, deleteDoc } from "firebase/firestore";
import { database } from "../../../firebase/firebase";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./users.module.scss";
import Loader from "../../../components/loader/Loader";
import Notiflix from "notiflix";
import { toast } from "react-toastify";

export default function Users() {
  const { data, loading } = useFetchCollection("Users");
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);

  useEffect(() => {
    dispatch(STORE_USERS(data));
  }, [dispatch, data]);

  const deleteUserFromDatabase = async (id) => {
    try {
      await deleteDoc(doc(database, "Users", id));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmDelete = (id, username) => {
    Notiflix.Confirm.show(
      "Delete Product",
      `Are you sure you want to delete ${username} from the users list?`,
      "DELETE",
      "CANCEL",
      function okCb() {
        deleteUserFromDatabase(id);
        toast.success(`You have deleted ${username} from your users list`);
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

  if (users.length === 0) {
    return <Loader />;
  }

  return (
    <section className={styles.sec}>
      <div className={`container ${styles.order}`}>
        <h2>Users</h2>
        <br />
        <>
          <div className={styles.table}>
            {users.length === 0 ? (
              <p>You have no users at the moment</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Assigned ID</th>
                    <th>Date Joined</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Delete User</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const { id, email, username, joinedAt } = user;
                    return (
                      <tr key={id}>
                        <td>{index + 1}</td>
                        <td>{id}</td>
                        <td>{joinedAt}</td>
                        <td>{email}</td>
                        <td>
                          <p style={{ fontWeight: "500" }}>{username}</p>
                        </td>
                        <td>
                          <FaTrashAlt
                            size={18}
                            color="red"
                            onClick={() => confirmDelete(id, username)}
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
      </div>
    </section>
  );
}
