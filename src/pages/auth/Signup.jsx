import React, { useState } from "react";
import signinImg from "../../assets/register.png";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./auth.module.scss";
import { useAuth } from "../../contexts/authContext";
import Loader from "../../components/loader/Loader";

export default function Signup() {
  const [userName, setUserName]  = useState('')
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { signup, updateName } = useAuth();

  const registerUser = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      window.setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signup(email, password);
      await updateName(userName)
      setLoading(false);
      // window.location.reload()
      navigate("/");
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
  };

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
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
              <button type="submit" className="--btn --btn-primary --btn-block">
                Continue
              </button>
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
