import React, { useState, useEffect } from 'react';
import '../Assets/Css/HomeCss/topbar.css'; // Import your updated CSS file
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import ProfileImg from "../Components/Home/ProfileImg";
import { get, remove } from "../Services/LocalStorageService";
import { useDispatch, useSelector } from 'react-redux';
import { logout as AdminLogout } from '../Redux/SliceAuthAdmin'
import { logout as UserLogout } from '../Redux/SliceAuthUser'
import { logout as DoctorLogout } from '../Redux/SliceAuthDoctor'
import axiosClient from '../AxiosClient';

const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

const admin = useSelector((state) => state.AuthAdmin);
const user = useSelector((state) => state.authUser);
const doctor = useSelector((state) => state.AuthDoctor);

  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isUserLoggedIn = user.isAuthenticated || admin.isAuthenticated || doctor.isAuthenticated;

  useEffect(() => {
    console.log("Refreshed")
  }, [isUserLoggedIn]);  


  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const logout = () => {
    setIsLoading(true);
    if (get("TOKEN_USER")) {
      axiosClient
      .post("/user/logout")
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(UserLogout());
          remove("TOKEN_USER");
        }
      })
      .catch((err) => {
        console.log(err);
      })
    } else if (get("TOKEN_ADMIN")) {
      axiosClient
      .post("/user/logout")
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(AdminLogout())
          remove("TOKEN_ADMIN");
        }
      })
      .catch((err) => {
        console.log(err);
      })
    } else if (get("TOKEN_DOCTOR")) {
      axiosClient
      .post("/user/logout")
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(DoctorLogout())
          remove("TOKEN_DOCTOR");

        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
    setIsLoading(false)
    navigate("/")
  }

  return (
    <div className="topbar">
      {isUserLoggedIn &&
        <div className="topbar-left">
          <ProfileImg />
        </div>
      }
      <div className={`icons ${!isUserLoggedIn ? 'justify-start' : 'justify-center'} `}>
        <a href="https://facebook.com" className="topbar-icon" aria-label="Facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://twitter.com" className="topbar-icon" aria-label="X (Twitter)">
          <img
            src="/img/x.png"
            className="w-[18px] h-[18px]"
            alt=""
          />
        </a>
        <a href="https://instagram.com" className="topbar-icon" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>

      </div>
      <div className="topbar-right">
        {isUserLoggedIn ?
          <button
            type='button'
            onClick={logout}
            className='bg-red-600 text-gray-200 rounded-lg px-6 py-2 font-medium'
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Logout"}
          </button>
          :
          <>
            <div className="dropdown">
              <button
                className="topbar-button topbar-button-white dropdown-toggle"
                onClick={toggleDropdown}
              >
                Login/Signup
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/user-login" className="dropdown-item">Login</Link>
                  <Link to="/user-signup" className="dropdown-item">Signup</Link>
                </div>
              )}
            </div>

            <Link to="/doctor/signup" className="topbar-button topbar-button-blue">Join as a Doctor</Link>
          </>
        }
      </div>
    </div>
  );
};

export default TopBar;
