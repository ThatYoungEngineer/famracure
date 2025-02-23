import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../Assets/Css/HomeCss/header.css";
// import ProfileImg from "./ProfileImg";
import { useTranslation } from "react-i18next";
// import SelelctLang from "./SelelctLang";
import "../../Assets/Css/HomeCss/topbar.css";
import TopBar from "../TopBar";

const Header = () => {
  const { t } = useTranslation();
  const [Toggle, setToggle] = useState(false);
 
  return (
    <div>
      <TopBar/>
      <header className="header posit_rela">
        <div className="Header_container _container">
          <div className="logo_siz d_flex">
            <Link to={"/"}>
              <img src="/img/final logo-01.png" className="logo_nav" alt="Logo" />
            </Link>
            <div className="menu_mobile">
              {Toggle ? (
                <button className="btn_menu" onClick={() => setToggle(!Toggle)}>
                  <i className="fa-regular fa-xmark-large"></i>
                </button>
              ) : (
                <button className="btn_menu" onClick={() => setToggle(!Toggle)}>
                  <i className="fa-light fa-bars"></i>
                </button>
              )}
            </div>
          </div>
          <div className={Toggle ? "shaw menu  " : "menu "}>
            <ul className="nav_items h-fit">
              <li className="nav_item">
                <Link to={"/"} className="nav_link">
                  {t("Header.Home")}
                </Link>
              </li>
              <li className="nav_item">
                <Link to={"/search-doctor"} className={"nav_link"}>
                  {t("Header.Find_Doctor")}
                </Link>
              </li>
              <li className="nav_item">
                <Link to={"/about"} className="nav_link">
                  {t("Header.About")}
                </Link>
              </li>
              <li className="nav_item">
                <Link to={"/contact"} className={"nav_link"}>
                  {t("Header.Contact")}
                </Link>
              </li>

              {/* <li className="nav_item">
                <Link to={"/blogs"} className={"nav_link"}>
                  {t("Header.blogs")}
                </Link>
              </li> */}
              {/* Commented out or removed Login/Register buttons */}
              {/* <li className="nav_item">
                <Link to={"/login"} className="nav_link">
                  {t("Header.Login")}
                </Link>
              </li>
              <li className="nav_item">
                <Link to={"/register"} className="nav_link">
                  {t("Header.Register")}
                </Link>
              </li> */}
            </ul>
            {/* <ProfileImg /> */}
            {/* <SelelctLang /> */}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
