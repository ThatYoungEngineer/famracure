import { Link } from "react-router-dom";
import '../Assets/Css/HomeCss/Signup.css';
import { useNavigate } from "react-router";
import axiosClient from "../AxiosClient.js";
import React, { useEffect, useState } from "react";
import FooterTopBar from "../Components/FooterTopBar";
import { signUpSuccess } from "../Redux/SliceAuthUser";
import { useDispatch, useSelector } from "react-redux";
import { Footer, Header, AuthButton } from "../Components";
import { get, storeInLocalStorage } from "../Services/LocalStorageService";


const Signup = () => {
  document.title = "Signup For User";

  const userData = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prefix, setPrefix] = useState("+1"); // Default country code

  const [DataForm, setData] = useState({
    firstname: "",
    lastname: "",
    cin: "",
    email: "",
    password: "",
    password_confirmation: "",
    date_of_birth: "",
    phone_number: "",
    gender: "",
    prefix: "",
  });
  const [error, setError] = useState({
    firstname: "",
    lastname: "",
    cin: "",
    email: "",
    password: "",
    password_confirmation: "",
    date_of_birth: "",
    phone_number: "",
    gender: "",
  });

  const HandleChangeData = (e) => {
    const { name, value } = e.target;

    if (name === "prefix") {
      setPrefix(value); // Update prefix separately, not affecting phone number
    } else if (name === "phone_number") {
      setData({ ...DataForm, phone_number: value }); // Store only the number
    } else {
      setData({ ...DataForm, [name]: value });
    }
  };


  useEffect(() => {
    if (userData.isAuthenticated && get("TOKEN_USER")) {
      navigate("/user/profile");
    }
  }, [navigate, userData.isAuthenticated]);

  const HandleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    DataForm.phone_number = prefix + DataForm.phone_number

    axiosClient
      .post("/user/register", DataForm)
      .then(({ data }) => {
        dispatch(signUpSuccess(data));
        storeInLocalStorage("TOKEN_USER", data.token);
        setLoading(false);
        navigate("/user/profile");
      })
      .catch((er) => {
        setLoading(false);
        if (er.response && er.response.status === 422) {
          setError({ ...error, ...er.response.data.errors });
        } else {
          console.log(er);
        }
      }).finally(() => {
        DataForm.phone_number = ""
      })
  };

  const handleClose = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Adding leading zero
    const day = ('0' + today.getDate()).slice(-2); // Adding leading zero
    return `${year}-${month}-${day}`;
  };
  return (
    <>
      <div className=" absolute w-[100%] h-[143vh]  add_img">
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
          <div className="h-[41rem] flex justify-center items-center "
          style={{
            height: '49rem',
          }}>
          
            <div className="  w-[27rem] rounded-md  bg-white pl-8 pt-7 pr-8 pb-7"
              style={{
                width: '40rem',
                position:'relative',
                right:'20%',
                top: '-3%',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className=" text-center">
                <div className="mb-[14px]">
                  <h1 className="mt-4 text-[25px] font-medium text-gray-900">
                  Welcome To Famracure
                  </h1>
                </div>
                <div>
                  <p className="text-[14px] text-slate-400">
                  You are creating your first DocAppoint account to get an appointment with a doctor!!
                  </p>
                </div>
              </div>
              <form className="p-5 pl-8 pr-8" onSubmit={HandleSubmit}>
                <div className="grid gap-6 mb-[20px] md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="FirstName"
                      className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="FirstName"
                      name="firstname"
                      className={
                        error.firstname !== ""
                          ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-[12px] rounded-lg focus:ring-red-500 focus:border-red-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          : "bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      }
                      placeholder="First Name"
                      required
                      onChange={HandleChangeData}
                    />
                    {error.firstname && (
                      <p className="mt-2 text-[11px] text-red-600 dark:text-red-500">
                        {error.firstname[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="LastName"
                      className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="LastName"
                      name="lastname"
                      className={
                        error.lastname !== ""
                          ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-[12px] rounded-lg focus:ring-red-500 focus:border-red-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          : "bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      }
                      placeholder="Last Name"
                      required
                      onChange={HandleChangeData}
                    />
                    {error.lastname && (
                      <p className="mt-2 text-[11px] text-red-600 dark:text-red-500">
                        {error.lastname[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-6 mb-[15px] md:grid-cols-2">
                {/* <div className="mb-[20px]">
                  <label
                    htmlFor="date_of_birth"
                    className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    className={
                      error.date_of_birth !== ""
                        ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-[12px] rounded-lg focus:ring-red-500 focus:border-red-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        : "bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    }
                    onChange={HandleChangeData}
                    required
                  />
                  {error.date_of_birth && (
                    <p className="mt-2 text-[11px] text-red-600 dark:text-red-500">
                      {error.date_of_birth[0]}
                    </p>
                  )}
                </div> */}
                      <div>
                        <label
                          htmlFor="date_of_birth"
                          className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
                        >
                          Gender
                        </label>
                        <select 
                          name="gender" id="gender"
                          onChange={HandleChangeData}
                            className={
                            error?.gender !== ""
                              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-[12px] rounded-lg focus:ring-red-500 focus:border-red-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              : "bg-gray-50 !border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          }
                        >
                          <option value="#" selected disabled  >--Select Gender--</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        {error?.gender && (
                          <p className="mt-2 text-[11px] text-red-600 dark:text-red-500">
                            {error?.gender[0]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="date_of_birth"
                          className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
                        >
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="date_of_birth"
                          name="date_of_birth"
                          className={
                            error.date_of_birth !== ""
                              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-[12px] rounded-lg focus:ring-red-500 focus:border-red-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              : "bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          }
                          onChange={HandleChangeData}
                          required
                          max={getTodayDate()} // Restrict to today's date or earlier
                        />
                        {error.date_of_birth && (
                          <p className="mt-2 text-[11px] text-red-600 dark:text-red-500">
                            {error.date_of_birth[0]}
                          </p>
                        )}
                      </div>




              </div>
                <div className="mb-[20px]">
                  <label
                    htmlFor="phone_number"
                    className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number
                  </label>
                  <div className="flex items-center">
                    <select 
                      value={prefix} 
                      name="prefix"
                      id="prefix"
                      onChange={HandleChangeData}
                      className={`bg-gray-50 !border !border-r-transparent text-xs rounded-lg rounded-r-none block !w-fit py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500  border-gray-300 `}
                    >
                      <option value="+92">+92 (PK)</option>
                      <option value="+1">+1 (USA)</option>
                      <option value="+91">+91 (IN)</option>
                      <option value="+44">+44 (UK)</option>
                      {/* Add more country codes */}
                    </select>
                    <input
                      type="number"
                      id="phone_number"
                      name="phone_number"
                      className={
                        error.phone_number !== ""
                          ? "bg-red-50 border border-l-transparent rounded-l-none border-red-500 text-red-900 placeholder-red-700 text-[12px] rounded-lg focus:ring-red-500 focus:border-red-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          : "bg-gray-50 border border-l-transparent rounded-l-none border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      }
                      placeholder="Phone Number"
                      onChange={HandleChangeData}
                      required
                    />
                  </div>
                  
                  {error.phone_number && (
                    <p className="mt-2 text-[11px] text-red-600 dark:text-red-500">
                      {error.phone_number[0]}
                    </p>
                  )}
                </div>
                
              <div className="grid gap-6 mb-[20px] md:grid-cols-2">
                <div className="mb-[20px]">
                  <label
                    htmlFor="email"
                    className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={
                      error.email !== ""
                        ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-[12px] rounded-lg focus:ring-red-500 focus:border-red-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        : "bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    }
                    placeholder="Email"
                    onChange={HandleChangeData}
                    required
                  />
                  {error.email && (
                    <p className="mt-2 text-[11px] text-red-600 dark:text-red-500">
                      {error.email[0]}
                    </p>
                  )}
                </div>
                  <div className="mb-[20px]">
                  <label
                    htmlFor="cin"
                    className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
                  >
                    National ID (CIN)
                  </label>
                  <input
                    type="text"
                    id="cin"
                    name="cin"
                    className={
                      error.cin !== ""
                        ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-[12px] rounded-lg focus:ring-red-500 focus:border-red-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        : "bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    }
                    placeholder="National ID"
                    onChange={HandleChangeData}
                    required
                  />
                  {error.cin && (
                    <p className="mt-2 text-[11px] text-red-600 dark:text-red-500">
                      {error.cin[0]}
                    </p>
                  )}
                </div>
                </div>
                <div className="grid gap-6 mb-[15px] md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="Password"
                      className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="Password"
                      name="password"
                      className={
                        error.password !== ""
                          ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-[12px] rounded-lg focus:ring-red-500 focus:border-red-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          : "bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      }
                      placeholder="•••••••••"
                      required
                      onChange={HandleChangeData}
                    />
                    {error.password && (
                      <p className="mt-2 text-[11px] text-red-600 dark:text-red-500">
                        {error.password[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-1 text-[12px] font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="password_confirmation"
                      className={
                        error.password_confirmation !== ""
                          ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-[12px] rounded-lg focus:ring-red-500 focus:border-red-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          : "bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      }
                      placeholder="•••••••••"
                      required
                      onChange={HandleChangeData}
                    />
                    {error.password_confirmation && (
                      <p className="mt-2 text-[11px] text-red-600 dark:text-red-500">
                        {error.password_confirmation[0]}
                      </p>
                    )}
                  </div>
                </div>



                <button
                  type="submit"
                  className="text-white bg-gradient-to-br from-[#2EB0F7] to-[#044DA1] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-[12px] w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Register
                </button>
              </form>

<div className="flex justify-center items-center mb-4">
  <p className="mt-4 text-[14px] text-gray-500 sm:mt-0">
    Already have an account?
    <Link to="/user-login" className="text-gray-700 underline">
      {" "}
      Log in
    </Link>
    .
  </p>
</div>
<div className="flex justify-center items-center">
  <p className="mt-4 text-[14px] text-blue-600 sm:mt-0">
    <Link to="/doctor/signup">Are you a doctor?</Link>
  </p>
</div>

            </div>
          </div>
          <FooterTopBar/>
          <Footer colorText="white" />
        </div>
      </div>
    </>
  );
};

export default Signup;
