import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUsers, STORE_USERS } from "../../../redux/slice/authSlice";
import useFetchCollection from "../../../hooks/useFetchCollection";
import styles from "./users.module.scss";
import Loader from "../../../components/loader/Loader";

export default function Users() {
  const { data, loading } = useFetchCollection("Users");
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);

  useEffect(() => {
    dispatch(STORE_USERS(data));
  }, [dispatch, data]);


  return (
    <section className={styles.sec}>
      <div className={`container ${styles.order}`}>
        <h2>Users</h2>
        <br />
        <>
          {loading && <Loader />}
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
