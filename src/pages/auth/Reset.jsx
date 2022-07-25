import { useState } from "react";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import resetImg from "../../assets/forgot.png";
import styles from "./auth.module.scss";
import { useAuth } from "../../contexts/authContext";
import Loader from "../../components/loader/Loader";

export default function Reset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const resetUserPassword = async (e) => {
    e.preventDefault();

    if (email === "") {
      setError("Enter your email");
      window.setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    try {
      setError("");
      setMessage("");
      setLoading(true);
      await resetPassword(email);
      setEmail("");
      setLoading(false);
      setMessage(
        "Check your inbox for further instructions (Ensure to check spam folder)."
      );
      window.setTimeout(() => {
        setMessage("REDIRECTING...");
      }, 5000);
      window.setTimeout(() => {
        navigate("/login");
      }, 7000);
    } catch (err) {
      if (err.message === "Firebase: Error (auth/user-not-found).") {
        setError("This email is not registered");
        window.setTimeout(() => {
          setError("");
        }, 3000);
      }
      if (err.message === "Firebase: Error (auth/invalid-email).") {
        setError("Invalid email");
        window.setTimeout(() => {
          setError("");
        }, 3000);
      }
      if (err.message === "Firebase: Error (auth/too-many-requests).") {
        setError("Reset password limit exceeded");
        window.setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
    setLoading(false);
  };

  return (
    <section className={`container ${styles.auth}`}>
      {loading && <Loader />}
      <div className={styles.img}>
        <img src={resetImg} alt="login" width="400" />
      </div>
      <Card>
        <div className={styles.form}>
          <h2>Reset Password</h2>
          {error && <p className="alert error">{error}</p>}
          {message && <p className="alert message">{message}</p>}
          <div className={styles.info}>
            <p>
              If the email goes to your spam folder, click on 'Report as not
              spam', this will move the mail from spam to your inbox. then go to your
              inbox and continue from there.
            </p>
          </div>
          <form>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              onClick={resetUserPassword}
              className="--btn --btn-primary --btn-block"
            >
              Proceed
            </button>
            <div className={styles.links}>
              <p style={{ fontWeight: 600 }}>
                <Link to="/login">- Login</Link>
              </p>
              <p style={{ fontWeight: 600 }}>
                <Link to="/signup">Sign Up -</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </section>
  );
}
