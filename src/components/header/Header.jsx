import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RiMenuAddLine, RiShoppingCartLine } from "react-icons/ri";
import { VscEyeClosed } from "react-icons/vsc";
import { FaUserCircle } from "react-icons/fa";
import styles from "./header.module.scss";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-toastify";
import { auth } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { SET_ACTIVE_USER } from "../../redux/slice/authSlice";
import { REMOVE_ACTIVE_USER } from "../../redux/slice/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLinks/HiddenLink";
import { AdminOnlyLink } from "../adminOnlyRoute/AdminOnlyRoute";
import {
  CALCULATE_TOTAL_QUANTITY,
  selectCartTotalQuantity,
} from "../../redux/slice/cartSlice";

const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h3>
        Shop<span>Land</span>
      </h3>
    </Link>
  </div>
);
const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [scrollPage, setScrollpage] = useState(false);
  const [displayName, setDisplayname] = useState(null);
  const navigate = useNavigate;
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const cartTotalQty = useSelector(selectCartTotalQuantity);

  const cart = (
    <span className={styles.cart}>
      <Link to="/cart">
        <RiShoppingCartLine size={20} className={styles["cart-icon"]} />
        <p>{cartTotalQty}</p>
      </Link>
    </span>
  );

  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, [dispatch]);

  const fixNavbar = () => {
    if (window.scrollY > 50) {
      setScrollpage(true);
    } else {
      setScrollpage(false);
    }
  };
  window.addEventListener("scroll", fixNavbar);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName === null) {
          const u1 = user.email.substring(0, user.email.indexOf("@"));
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          setDisplayname(uName);
        } else {
          setDisplayname(user.displayName);
        }
        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userID: user.uid,
            userName: user.displayName ? user.displayName : displayName,
          })
        );
      } else {
        setDisplayname("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  const logoutUser = async () => {
    await logout();
    toast.success("Log out successful", {
      autoClose: 5000,
      pauseOnFocusLoss: false,
    });
    navigate("/");
  };

  return (
    <header className={scrollPage ? `${styles.fixed}` : null}>
      <div className={styles.header}>
        {logo}
        <nav
          className={
            showMenu ? `${styles["show-nav"]}` : `${styles["hide-menu"]}`
          }
        >
          <div
            className={
              showMenu
                ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                : `${styles["nav-wrapper"]}`
            }
            onClick={hideMenu}
          ></div>
          <ul onClick={hideMenu}>
            <li className={styles["logo-mobile"]}>
              {logo}
              <VscEyeClosed size={22} color="#fff" />
            </li>
            <li>
              <AdminOnlyLink>
                <Link to="/admin/home">
                  <button className="--btn --btn-primary">Admin</button>
                </Link>
              </AdminOnlyLink>
            </li>
            <li>
              <NavLink to="/" className={activeLink}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={activeLink}>
                Contact Us
              </NavLink>
            </li>
          </ul>
          <div className={styles["header-right"]} onClick={hideMenu}>
            <span className={styles.links}>
              <ShowOnLogout>
                <NavLink to="/login" className={activeLink}>
                  Login
                </NavLink>
              </ShowOnLogout>
              <ShowOnLogin>
                <a style={{ color: "#c07d53" }}>
                  <FaUserCircle size={16} />
                  &nbsp; Hi, {displayName}
                </a>
              </ShowOnLogin>
              <ShowOnLogout>
                <NavLink to="/signup" className={activeLink}>
                  Sign Up
                </NavLink>
              </ShowOnLogout>
              <ShowOnLogin>
                <NavLink to="/order-history" className={activeLink}>
                  My orders
                </NavLink>
              </ShowOnLogin>
              <ShowOnLogin>
                <NavLink to="/" onClick={logoutUser}>
                  Log out
                </NavLink>
              </ShowOnLogin>
            </span>
            {cart}
          </div>
        </nav>

        <div className={styles["menu-icon"]}>
          {cart}
          <RiMenuAddLine size={28} onClick={toggleMenu} />
        </div>
      </div>
    </header>
  );
}
