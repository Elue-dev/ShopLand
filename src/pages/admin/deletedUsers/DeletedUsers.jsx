import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DELETED_USERS, selectDeletedUsers } from "../../../redux/slice/authSlice";
import useFetchCollection from "../../../hooks/useFetchCollection";
import styles from "./deletedUsers.module.scss";
import Loader from "../../../components/loader/Loader";

export default function Users() {
  const { data, loading } = useFetchCollection("Deleted-Users");
  const dispatch = useDispatch();
  const deletedUsers = useSelector(selectDeletedUsers);

  useEffect(() => {
    dispatch(DELETED_USERS(data));
  }, [dispatch, data]);

  return (
    <section className={styles.sec}>
      <div className={`container ${styles.order}`}>
       {!loading && <h2>Deleted Users</h2>}
        <br />
        <>
          {loading && <Loader />}
          <div className={styles.table}>
            {deletedUsers.length === 0 ? (
              <p>You have no deleted users at the moment</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Assigned ID</th>
                    <th>Date Deleted</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedUsers.map((user, index) => {
                    const { id, email, deletedAt } = user;
                    return (
                      <tr key={id}>
                        <td>{index + 1}</td>
                        <td>{id}</td>
                        <td>{deletedAt}</td>
                        <td>{email}</td>
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
