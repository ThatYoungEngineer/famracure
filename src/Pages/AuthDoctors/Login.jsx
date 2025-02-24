import React, { useEffect, useState } from "react";
import {
  AlertErrorMessage,
  AuthButton,
  Footer,
  Header,
} from "../../Components";
import { useDispatch, useSelector } from "react-redux";
import { get, storeInLocalStorage } from "../../Services/LocalStorageService";
import { useNavigate } from "react-router";
import axiosClient from "../../AxiosClient";
import { loginSuccess } from "../../Redux/SliceAuthDoctor";
import { Link } from "react-router-dom";

const Login = () => {
  document.title = "Doctors Login";

  const doctorData = useSelector((state) => state.AuthDoctor);
  const navigate = useNavigate();
  console.log(doctorData);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (doctorData.isAuthenticated && get("TOKEN_DOCTOR")) {
      navigate("/doctor/dashboard");
    }
  }, [navigate, doctorData.isAuthenticated]);

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
    setLoading(true);
    e.preventDefault();
    axiosClient
      .post("/doctor/login", DataForm)
      .then(({ data }) => {
        console.log({ data });
        dispatch(loginSuccess(data));

        storeInLocalStorage("TOKEN_DOCTOR", data.token);
        setLoading(false);
        navigate("/doctor/dashboard");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          setError(err.response.data.message);
          console.log(err);
        } else {
          console.log(err);
        }
      });
  };

  
  const handleClose = () => {
    // Implement the logic to close or hide the form
    navigate(-1); // This will navigate back to the previous page
  };
  return (
    <>
      <div className=" absolute w-[100%] h-[133vh] add_img">
        <div className="" 
        
        style={{
        // background:'#587fd9',
        height: '810px',
        backgroundImage: "url('/img/login-Signup-Banner.jpg')",


        // height: 839px;
        // background-image: url(/img/login-Signup-Banner.jpg);
        backgroundSize: 'contain',
        backgroundPosition:'center',
        backgroundRepeat: 'no-repeat',
      }}
        
        
        
        >
          <Header />
          <div className="h-[41rem] flex justify-center items-center ">
            <div className="  w-[27rem] rounded-md  bg-white pl-8 pt-7 pr-8 pb-7"
             style={{
              position: 'relative',
              right: '24%',
              top: '-14.5%',
            }}
            >
              <div className=" text-center">
                {/* <div className="flex justify-center items-center">
                  <img src="/img/logo.png" className="w-[123px]" alt="" />
                </div> */}
                <div className="mb-[14px]">
                  <h1 className="mt-4 text-[25px] font-medium text-gray-900 ">
                    Login As a Doctor
                  </h1>
                </div>
                <div>
  <p className="text-[14px] text-slate-400">
    You are creating your first DocAppoint account to schedule an appointment with a doctor!
  </p>
</div>

              </div>
              {error && <AlertErrorMessage message={error} />}
              <form className="p-5 pl-8 pr-8 relative" onSubmit={HandleSubmit}>
  {/* <button
    type="button"
    style={{
      position: 'absolute',
      top: '-94%',
      right: '-10%',
      backgroundColor: 'black',
      color: 'white',
      border: 'none',
      padding: '8px',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'background-color 0.3s, color 0.3s',
    }}
    onClick={handleClose}
  >
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      ></path>
    </svg>
  </button> */}
  
  <div className="mb-[20px]">
    <label
      htmlFor="email"
      className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
    >
      Email
    </label>
    <input
      type="text"
      id="email"
      name="email"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="example@gmail.com"
      required
      onChange={HandleChangeData}
    />
  </div>

  <div className="mb-[20px]">
    <label
      htmlFor="password"
      className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
    >
      Password
    </label>
    <input
      type="password"
      id="password"
      name="password"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="•••••••••"
      required
      onChange={HandleChangeData}
    />
  </div>
  
  <div className="mb-2">
    <a href="/forgot-password" className="flex flex-row-reverse">
      <span className="text-medium tracking-wide text-[13px] text-blue-600">
        Forgot your password?
      </span>
    </a>
  </div>

  <div className="flex justify-center items-center w-full">
    <AuthButton Text={"Login"} Loading={loading} />


  </div>
  
</form>

              <div className="flex justify-center items-center mb-4">
  <p className="mt-4 text-[14px] text-gray-500 sm:mt-0">
    Don't have an account?
    <Link to="/doctor/signup" className="text-gray-700 underline">
      Sign up
    </Link>
    .
  </p>
</div>

            </div>
          </div>
        
          <Footer colorText="white" />
        </div>
      </div>
    </>
  );
};

export default Login;
