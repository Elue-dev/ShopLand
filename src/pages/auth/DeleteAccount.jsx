import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "../../components/card/Card";
import { useAuth } from "../../contexts/authContext";
import { IoIosEye, IoMdEyeOff } from "react-icons/io";
import DeleteUser from "../../assets/deleteuser.png";
import Notiflix from "notiflix";
import spinnerImg from "../../assets/spinner.jpg";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import styles from "./auth.module.scss";

export default function DeleteAccount() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(false);
  const [disable, setDisable] = useState(false);

  const userEmail = user.email;
  const credential = EmailAuthProvider.credential(email, password);

  useEffect(() => {
    if (!email || !password) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [email, password]);

  const reAuthenticate = () => {
    setLoading(true);
    reauthenticateWithCredential(user, credential)
      .then(() => {
        deleteAccount();
        setLoading(false);
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        if (err.message === "Firebase: Error (auth/user-token-expired).") {
          setError(
            "it has been long since your last login, please logout and login again to proceed"
          );
          window.setTimeout(() => {
            setError("");
          }, 3000);
        }
        if (err.message === "Firebase: Error (auth/wrong-password).") {
          setError("Wrong password");
          window.setTimeout(() => {
            setError("");
          }, 3000);
        }
        if (err.message === "Firebase: Error (auth/user-mismatch).") {
          setError("Invalid Email");
          window.setTimeout(() => {
            setError("");
          }, 3000);
        }
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Notiflix.Confirm.show(
        "Delete Account",
        "Are you sure you want to delete your account?",
        "PROCEED",
        "CANCEL",
        function okCb() {
          reAuthenticate();
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
    } catch (error) {
      toast.error(error.message);
    }

    const today = new Date();
    const date = today.toDateString();
    const usersConfig = {
      assignedID: uuidv4(),
      email: userEmail,
      deletedAt: date,
      createdAt: Timestamp.now().toDate(),
    };
    try {
      const usersRef = collection(database, "Deleted-Users");
      await addDoc(usersRef, usersConfig);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteAccount = () => {
    deleteUser(user)
      .then(() => {
        toast.success("Your account has been deleted");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleShowPassword = () => {
    setView(!view);
    if (passwordRef.current.type === "password") {
      passwordRef.current.setAttribute("type", "text");
    } else {
      passwordRef.current.setAttribute("type", "password");
    }
  };

  return (
    <section className={`container ${styles.auth}`}>
      <div className={styles.img}>
        <img src={DeleteUser} alt="login" width="400" />
      </div>
      <Card cardClass={styles.card}>
        <div className={styles.form}>
          <h2>Confirm your details</h2>
          {error && <p className="alert error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              required
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className={styles.label}>
              <input
                type="password"
                required
                value={password}
                ref={passwordRef}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={handleShowPassword}>
                {view ? <IoIosEye /> : <IoMdEyeOff />}
              </span>
            </label>
            {disable ? (
              <button
                disabled
                className={`${styles.button} ${styles.disabled}`}
              >
                Proceed
              </button>
            ) : (
              <button type="submit" className="--btn --btn-primary --btn-block">
                {loading ? (
                  <img
                    src={spinnerImg}
                    alt="loading..."
                    style={{ width: "25px", height: "25px" }}
                  />
                ) : (
                  "Proceed"
                )}
              </button>
            )}
          </form>
        </div>
      </Card>
    </section>
  );
}
