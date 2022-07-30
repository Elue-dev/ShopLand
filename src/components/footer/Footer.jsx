import React from "react";
import { IoIosHome } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { HiSaveAs, HiUserAdd } from "react-icons/hi";
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { FaUserMinus } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { RiContactsBookUploadFill, RiLuggageCartFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";
import styles from "./footer.module.scss";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  const { user, logout } = useAuth();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  const logoutUser = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className={styles.footer}>
      <ul className="container">
        <span>Quick links</span>
        <div className={styles.flex}>
          <li>
            <IoIosHome />
            <Link to="/">Home</Link>
          </li>
          <li>
            <RiContactsBookUploadFill />
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <RiLuggageCartFill />
            <Link to="/order-history">Orders</Link>
          </li>
          <li>
            <TiShoppingCart />
            <Link to="/cart">Cart</Link>
          </li>
          <li>
            <IoNotifications />
            <Link to="/notifications">Notifications</Link>
          </li>
          <li>
            <HiSaveAs />
            <Link to="/saved-products">Saved products</Link>
          </li>

          {user && (
            <>
              <li onClick={logoutUser}>
                <BiLogOut />
                <p>Logout</p>
              </li>
              <li>
                <FaUserMinus />
                <Link to="/delete-account">Delete Account</Link>
              </li>
            </>
          )}
          {!isLoggedIn ? (
            <>
              <li>
                <BiLogIn />
                <Link to="/login">Login</Link>
              </li>
              <li>
                <HiUserAdd />
                <Link to="/signup">Sign up</Link>
              </li>
            </>
          ) : null}
        </div>
      </ul>

      <div className={styles.copyright}>&copy; {year} All Rights Reserved</div>
    </div>
  );
};

export default Footer;
