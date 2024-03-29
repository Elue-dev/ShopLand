import { useEffect, useState, useRef } from "react";
import Card from "../../components/card/Card";
import { FaGoogle } from "react-icons/fa";
import { IoIosEye, IoMdEyeOff } from "react-icons/io";
import loginImg from "../../assets/login.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./auth.module.scss";
import { useAuth } from "../../contexts/authContext";
import spinnerImg from "../../assets/spinner.jpg";
import { useSelector } from "react-redux";
import { selectPreviousURL } from "../../redux/slice/cartSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef();
  const [view, setView] = useState(false);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, googleSignIn } = useAuth();
  const previousURL = useSelector(selectPreviousURL);

  const redirectUser = () => {
    if (previousURL.includes("cart")) {
      return navigate("/cart");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (!email || !password) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [email, password]);

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      await login(email, password);
      setLoading(false);
      redirectUser();
    } catch (error) {
      if (error.message === "Firebase: Error (auth/user-not-found).") {
        setError("User not found");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (error.message === "Firebase: Error (auth/wrong-password).") {
        setError("Wrong password");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Please check your internet connection");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (
        error.message ===
        "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
      ) {
        setError(
          "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later"
        );
        window.setTimeout(() => {
          setError("");
        }, 12000);
      }
    }
    setLoading(false);
  };

  const handleShowPassword = () => {
    setView(!view);
    if (passwordRef.current.type === "password") {
      passwordRef.current.setAttribute("type", "text");
    } else {
      passwordRef.current.setAttribute("type", "password");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      redirectUser();
    } catch (err) {
      if (err.message === "Firebase: Error (auth/popup-closed-by-user).") {
        setError("Google sign in failed. (You exited the google sign in)");
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
      if (err.message === "Firebase: Error (auth/network-request-failed).") {
        setError(
          "Google sign in failed, this is mostly due to network connectivity issues, please check your network and try again."
        );
        window.setTimeout(() => {
          setError("");
        }, 6000);
      }
    }
  };

  return (
    <>
      <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
          <img src={loginImg} alt="login" width="400" />
        </div>
        <Card>
          <div className={styles.form}>
            <h2>Login</h2>
            {error && <p className="alert error">{error}</p>}

            <form onSubmit={loginUser}>
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
                  required
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
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="--btn --btn-primary --btn-block"
                >
                  {loading ? (
                    <img
                      src={spinnerImg}
                      alt="loading..."
                      style={{ width: "25px", height: "25px" }}
                    />
                  ) : (
                    "Continue"
                  )}
                </button>
              )}

              <div className={styles.links}>
                <Link to="/reset">Forgot password?</Link>
              </div>
              <p>-- OR --</p>
            </form>
            <button
              className="--btn --btn-danger --btn-block"
              onClick={handleGoogleSignIn}
            >
              <FaGoogle color="#fff" />
              &nbsp; Login With Google
            </button>
            <span className={styles.register}>
              <p>
                No Shop<span>Land</span> account?
              </p>
              &nbsp; <Link to="/signup">Sign Up</Link>
            </span>
          </div>
        </Card>
      </section>
    </>
  );
}
