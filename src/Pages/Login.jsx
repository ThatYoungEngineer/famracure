import React, { useEffect, useState } from "react";
import { AlertErrorMessage, AuthButton, Footer, Header } from "../Components";
import { useDispatch, useSelector } from "react-redux";
import { get, storeInLocalStorage } from "../Services/LocalStorageService";
import { useNavigate } from "react-router";
import axiosClient from "../AxiosClient";
import { loginSuccess } from "../Redux/SliceAuthUser";
import { Link } from "react-router-dom";
import "../Assets/Css/HomeCss/Login.css";
import FooterTopBar from "../Components/FooterTopBar";
const Login = () => {
  document.title = "login";

  const userData = useSelector((state) => state.authUser);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData.isAuthenticated && get("TOKEN_USER")) {
      navigate("/user/profile");
    }
  }, [navigate, userData.isAuthenticated]);

  const [DataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const HandleChangeData = (ev) => {
    const { name, value } = ev.target;
    setDataForm({ ...DataForm, [name]: value });
  };

const HandleSubmit = (e) => {
  setError('');
  setLoading(true);
  e.preventDefault();

  axiosClient.post("/user/login", DataForm)
    .then((res) => {
      if (res.data.error) {
        setError(res.data.error);
      } else {
        if (res.statusText === "OK" || res.status === 200) {
          dispatch(loginSuccess(res.data.user));
          storeInLocalStorage("TOKEN_USER", res.data.token);
          navigate("/user/profile");
        }
      }
    })
    .catch((error) => {
      const errorMessage = error?.response?.data?.message;
      if (error.toString().includes("Request failed with status code 422")) {
        setError("Invalid Credentials");
      } else if (errorMessage) {
        setError(errorMessage);
      } else {
        setError("Network error");
      }
    })
    .finally(() => {
      setLoading(false);
    })
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Background container */}
      {/* style={{ backgroundImage: "url('/img/Signup-bg.jpg')", height: '810px' }} */}
      <div className="" style={{
        // background:'#587fd9',
        height: '810px',
        backgroundImage: "url('/img/login-Signup-Banner.jpg')",


        // height: 839px;
        // background-image: url(/img/login-Signup-Banner.jpg);
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} >
        <div className="relative  h-full bg-opacity-75">
          <Header />
          {/* Center the form */}
          <div className="flex justify-center items-center h-full">
            <div className="w-[27rem] bg-white rounded-lg shadow-lg p-8 l-from"
              style={{
                position: 'relative',
                right: '24%',
                top: '-20%',
              }}

            >
              {/* Logo */}
              <div className="text-center mb-5">
                {/* <img src="/img/logo.png" className="mx-auto w-28" alt="Logo" /> */}
                <h1 className="text-2xl font-semibold text-gray-900 mt-4">
                  Get Start Now
                </h1>
                <p className="text-sm text-slate-400 mt-2">
                  Enter your credential to access your account
                </p>
              </div>

              {/* Error Message */}
              {error && <AlertErrorMessage message={error} />}

              {/* Form */}
              <form onSubmit={HandleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="example@gmail.com"
                    required
                    onChange={HandleChangeData}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="Password" className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <input
                    type="password"
                    id="Password"
                    name="password"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="•••••••••"
                    required
                    onChange={HandleChangeData}
                  />
                </div>

                {/* Forgot Password */}
                <div className="text-right mb-4">
                  <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                    Forgot your password?
                  </Link>
                </div>

                {/* Login Button */}
                <div className="flex justify-center">
                  <AuthButton Text="Login" Loading={loading} />
                </div>
                <div className="flex justify-center mt-2.5">

                </div>
              </form>

              {/* Sign Up & Doctor Login */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Don't have an account? <Link to="/user-signup" className="text-indigo-600 hover:underline">Sign Up</Link>
                </p>
                <p className="text-sm text-indigo-600 mt-2">
                  <Link to="/doctor/login">Are you a doctor?</Link>
                </p>
              </div>
            </div>
          </div>
          <FooterTopBar />
          <Footer colorText="white" />
        </div>
      </div>
    </>
  );
};

export default Login;
