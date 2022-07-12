import React, { useState, useEffect, useRef } from "react";
import signinImg from "../../assets/register.png";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./auth.module.scss";
import { useAuth } from "../../contexts/authContext";
import { GoPrimitiveDot } from "react-icons/go";
import { ImCheckmark } from "react-icons/im";
import { IoIosEye, IoMdEyeOff } from "react-icons/io";
import spinnerImg from "../../assets/spinner.jpg";
import Loader from "../../components/loader/Loader";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { selectPreviousURL } from "../../redux/slice/cartSlice";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef();
  const [view, setView] = useState(false);
  const [caseCondition, setCaseCondition] = useState(false);
  const [numberCondition, setNumberCondition] = useState(false);
  const [charCondition, setCharCondition] = useState(false);
  const [lengthCondition, setLengthCondition] = useState(false);
  const [passwordComplete, setPasswordComplete] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { signup, updateName } = useAuth();
  const previousURL = useSelector(selectPreviousURL);

  const redirectUser = () => {
    if (previousURL.includes("cart")) {
      return navigate("/cart");
    } else {
      navigate("/");
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      await signup(email, password);
      await updateName(userName);
      setLoading(false);
      // window.location.reload()
      redirectUser()
      toast.success("Successfully signed in", {
        autoClose: 5000,
        pauseOnFocusLoss: false,
      });
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        setError("Email already in use");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      if (
        error.message ===
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        setError("Password should be at least 6 characters");
        window.setTimeout(() => {
          setError("");
        }, 3000);
      }
      if (error.message === "Firebase: Error (auth/invalid-email).") {
        setError("Invalid email");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Please check your internet connection");
        window.setTimeout(() => {
          setError("");
        }, 5000);
      }
      setLoading(false);
    }

    // =====add users=======
    const today = new Date();
    const date = today.toDateString();
    const usersConfig = {
      assignedID: uuidv4(),
      username: userName,
      email: email,
      joinedAt: date,
      createdAt: Timestamp.now().toDate(),
    };
    try {
      const usersRef = collection(database, "Users");
      await addDoc(usersRef, usersConfig);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowPassword = () => {
    setView(!view);
    if (passwordRef.current.type === "password") {
      passwordRef.current.setAttribute("type", "text");
    } else {
      passwordRef.current.setAttribute("type", "password");
    }
  };

  useEffect(() => {
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      setCaseCondition(true);
    } else {
      setCaseCondition(false);
    }
    if (password.match(/([0-9])/)) {
      setNumberCondition(true);
    } else {
      setNumberCondition(false);
    }
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      setCharCondition(true);
    } else {
      setCharCondition(false);
    }
    if (password.length > 5 && password.length <= 12) {
      setLengthCondition(true);
    } else {
      setLengthCondition(false);
    }

    if (caseCondition && numberCondition && charCondition && lengthCondition) {
      setPasswordComplete(true);
    } else {
      setPasswordComplete(false);
    }
  }, [
    password,
    caseCondition,
    numberCondition,
    charCondition,
    lengthCondition,
    passwordComplete,
  ]);

  return (
    <>
      {loading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <Card>
          <div className={styles.form}>
            <h2>Sign Up</h2>
            {error && <p className="alert error">{error}</p>}
            <form onSubmit={registerUser}>
              <input
                type="text"
                value={userName}
                placeholder="Name"
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className={styles.label}>
                <input
                  type="password"
                  value={password}
                  ref={passwordRef}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPassFocus(true)}
                  required
                />
                <span onClick={handleShowPassword}>
                  {view ? <IoIosEye /> : <IoMdEyeOff />}
                </span>
              </label>

              <div
                className={
                  passFocus
                    ? `${styles.indicator} ${styles.show}`
                    : `${styles.indicator}`
                }
              >
                <span className={styles.strength}>Password must include:</span>
                <ul>
                  <li
                    className={
                      caseCondition ? `${styles.green}` : `${styles.red}`
                    }
                  >
                    {caseCondition ? <ImCheckmark /> : <GoPrimitiveDot />}
                    &nbsp; Uppercase & lowercase letters
                  </li>
                  <li
                    className={
                      lengthCondition ? `${styles.green}` : `${styles.red}`
                    }
                  >
                    {lengthCondition ? <ImCheckmark /> : <GoPrimitiveDot />}
                    &nbsp; 6-12 characters
                  </li>
                  <li
                    className={
                      numberCondition ? `${styles.green}` : `${styles.red}`
                    }
                  >
                    {numberCondition ? <ImCheckmark /> : <GoPrimitiveDot />}
                    &nbsp; At least a number
                  </li>
                  <li
                    className={
                      charCondition ? `${styles.green}` : `${styles.red}`
                    }
                  >
                    {charCondition ? <ImCheckmark /> : <GoPrimitiveDot />}
                    &nbsp; At least one special character (!@#$%^&*)
                  </li>
                </ul>
              </div>
              {passwordComplete && (
                <button
                  type="submit"
                  className="--btn --btn-primary --btn-block"
                >
                  {loading ? (
                    <img
                      src={spinnerImg}
                      alt="loading..."
                      style={{ width: "30px", height: "30px" }}
                    />
                  ) : (
                    "Continue"
                  )}
                </button>
              )}
              {!passwordComplete && (
                <button
                  disabled
                  className={`${styles.button} ${styles.disabled}`}
                >
                  Continue
                </button>
              )}
              <span className={styles.register}>
                <p>
                  Have a Shop<span>Land</span> account?
                </p>
                <Link to="/login">Login</Link>
              </span>
            </form>
          </div>
        </Card>
        <div className={styles.img}>
          <img src={signinImg} alt="login" width="400" />
        </div>
      </section>
    </>
  );
}
