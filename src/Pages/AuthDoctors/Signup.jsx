import React, { useEffect, useState } from "react";
import { AuthButton, Footer, Header } from "../../Components";
import axiosClient from "../../AxiosClient.js";
import { useDispatch, useSelector } from "react-redux";
import { signUpSuccess } from "../../Redux/SliceAuthDoctor";
import { get, storeInLocalStorage } from "../../Services/LocalStorageService";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

//  import { storeInLocalStorage, get } from './utils'; 


const Signup = () => {
  document.title = "Signup For Doctors";

  const doctorData = useSelector((state) => state.AuthDoctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prefix, setPrefix] = useState("+1"); // Default country code

  useEffect(() => {
    if (doctorData.isAuthenticated && get("TOKEN_DOCTOR")) {
      navigate("/doctor/dashboard");
    }
  }, [navigate, doctorData.isAuthenticated]);

  const [DataForm, setData] = useState({
    firstname: "",
    lastname: "",
    country_code: prefix,
    phoneNumber: "",
    gender: "",
    email: "",
    password: "",
    password_confirmation: "",
    Matricule: "",
  });

  const [error, setError] = useState({
    firstname: [],
    lastname: [],
    phoneNumber: [],
    gender: [],
    email: [],
    password: [],
    Matricule: [],
  });



  const HandleChangeData = (e) => {
    const { name, value } = e.target;

    if (name === "country_code") {
      setPrefix(value);                                   // Update prefix separately, not affecting phone number
      setData({ ...DataForm, country_code: value });      // Store only the number
    } else if (name === "phoneNumber") {
      setData({ ...DataForm, phoneNumber: value });       // Store only the number
    } else {
      setData({ ...DataForm, [name]: value });
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    axiosClient
      .post("/doctor/register", DataForm)
      .then(({ data }) => {
        dispatch(signUpSuccess(data));
        storeInLocalStorage("TOKEN_DOCTOR", data.token);
        navigate("/doctor/verifyemail");
      })
      .catch((er) => {
        if (er.response && er.response.status === 422) {
          setError(er.response.data.errors || {});
        } else {
          console.error(er);
        }
      }).finally(() => {
        setLoading(false);
      })
  };

  // Helper function to get error message
  const getErrorMessage = (field) => {
    return error[field] && error[field].length > 0 ? error[field][0] : '';
  };

  // Close button handler
  const handleClose = () => {
    // Implement the logic to close or hide the form
    navigate(-1); // This will navigate back to the previous page
  };
  // Helper function to get error message

  return (
    <>
      <div className="h-screen">
        <div className=""

          style={{
            // background:'#587fd9',
            height: '810px',
            backgroundImage: "url('/img/login-Signup-Banner.jpg')",


            // height: 839px;
            // background-image: url(/img/login-Signup-Banner.jpg);
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}

        >
          <Header />
          <div className="h-[41rem] flex justify-center items-center ">
            <div className="w-[27rem] rounded-md bg-white pl-8 pt-7 pr-8 pb-7"
              style={{
                width: '40rem',
                position: 'relative',
                right: '20%',
                top: '10%',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              }}>
              <div className="text-center">
                <div className="mb-[14px]">
                  <h1 className="mt-4 text-[25px] font-medium text-gray-900">
                    Sing Up For Doctor
                  </h1>
                </div>
                <div>
                  <p className="text-[14px] text-slate-400">
                    You're creating your Famracare account to start managing patient appointments and offering consultations!
                  </p>
                </div>
              </div>

              <form className="relative p-5 pl-8 pr-8 space-y-5" onSubmit={HandleSubmit}>
                {/* Close Button */}
                {/* <button
  type="button"
  style={{
    position: 'absolute',
    top: '-60%',
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



                {/* Form Fields */}
                <div className="grid gap-6 mb-[20px] md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstname"
                      className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      className={`bg-gray-50 border text-xs rounded-lg block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${getErrorMessage('firstname') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700' : 'border-gray-300 text-gray-900'}`}
                      placeholder="First Name"
                      required
                      onChange={HandleChangeData}
                    />
                    {getErrorMessage('firstname') && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {getErrorMessage('firstname')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      className={`bg-gray-50 border text-xs rounded-lg block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${getErrorMessage('lastname') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700' : 'border-gray-300 text-gray-900'}`}
                      placeholder="Last Name"
                      required
                      onChange={HandleChangeData}
                    />
                    {getErrorMessage('lastname') && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {getErrorMessage('lastname')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-6 mb-[20px] md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="Matricule"
                      className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
                    >
                      Registration number
                    </label>
                    <input
                      type="text"
                      id="Matricule"
                      name="Matricule"
                      className={`bg-gray-50 border text-xs rounded-lg block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${getErrorMessage('Matricule') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700' : 'border-gray-300 text-gray-900'}`}
                      placeholder="Registration number"
                      onChange={HandleChangeData}
                      required
                    />
                    {getErrorMessage('Matricule') && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {getErrorMessage('Matricule')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number
                    </label>
                    <div className="flex items-center">
                      <select
                        value={prefix}
                        name="country_code"
                        id="country_code"
                        onChange={HandleChangeData}
                        className={`bg-gray-50 !border !border-r-transparent text-xs rounded-lg rounded-r-none block !w-fit py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${getErrorMessage('country_code') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700' : 'border-gray-300 text-gray-900'}`}
                      >
                        <option value="+92">+92 (PK)</option>
                        <option value="+1">+1 (USA)</option>
                        <option value="+91">+91 (India)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+61">+61 (Australia)</option>
                        <option value="+81">+81 (Japan)</option>
                        <option value="+49">+49 (Germany)</option>
                        <option value="+33">+33 (France)</option>
                        <option value="+39">+39 (Italy)</option>
                        <option value="+86">+86 (China)</option>
                        <option value="+7">+7 (Russia)</option>
                        <option value="+34">+34 (Spain)</option>
                        <option value="+55">+55 (Brazil)</option>
                        <option value="+27">+27 (South Africa)</option>
                        <option value="+82">+82 (South Korea)</option>
                        <option value="+31">+31 (Netherlands)</option>
                        <option value="+46">+46 (Sweden)</option>
                        <option value="+45">+45 (Denmark)</option>
                        <option value="+47">+47 (Norway)</option>
                        <option value="+48">+48 (Poland)</option>
                        <option value="+90">+90 (Turkey)</option>
                        <option value="+52">+52 (Mexico)</option>
                        <option value="+63">+63 (Philippines)</option>
                        <option value="+60">+60 (Malaysia)</option>
                        <option value="+65">+65 (Singapore)</option>
                        <option value="+20">+20 (Egypt)</option>
                        <option value="+966">+966 (Saudi Arabia)</option>
                        <option value="+971">+971 (UAE)</option>
                      </select>
                      <input
                        type="number"
                        id="phoneNumber"
                        name="phoneNumber"
                        className={`bg-gray-50 !border !border-l-transparent text-xs rounded-lg rounded-l-none block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${getErrorMessage('phoneNumber') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700' : 'border-gray-300 text-gray-900'}`}
                        placeholder="Phone Number"
                        onChange={HandleChangeData}
                        required
                      />

                    </div>
                    {getErrorMessage('phoneNumber') && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {getErrorMessage('phoneNumber')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 mb-[15px] md:grid-cols-2">
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
                      className={`bg-gray-50 !border text-xs rounded-lg block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${getErrorMessage('gender') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700' : 'border-gray-300 text-gray-900'}`}
                    >
                      <option value="#" selected disabled  >--Select Gender--</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="transgender">Transgender</option>
                    </select>
                    {getErrorMessage('gender') && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {getErrorMessage('gender')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className={`bg-gray-50 border text-xs w-full rounded-lg block py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${getErrorMessage('email') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700' : 'border-gray-300 text-gray-900'}`}
                      placeholder="Email"
                      onChange={HandleChangeData}
                      required
                    />
                    {getErrorMessage('email') && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {getErrorMessage('email')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className={`bg-gray-50 border text-xs rounded-lg block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${getErrorMessage('password') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700' : 'border-gray-300 text-gray-900'}`}
                      placeholder="Password"
                      required
                      onChange={HandleChangeData}
                    />
                    {getErrorMessage('password') && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {getErrorMessage('password')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="password_confirmation"
                      className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      className={`bg-gray-50 border text-xs rounded-lg block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${getErrorMessage('password_confirmation') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700' : 'border-gray-300 text-gray-900'}`}
                      placeholder="Confirm Password"
                      required
                      onChange={HandleChangeData}
                    />
                    {getErrorMessage('password_confirmation') && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                        {getErrorMessage('password_confirmation')}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Sign Up"}
                </button>
              </form>

              <div className="flex justify-center items-center mb-4">
                <p className="mt-4 text-[14px] text-gray-500 sm:mt-0">
                  Already have an account?
                  <Link to="/doctor/login" className="text-gray-700 underline">
                    Sign In
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
          <div className="mt-40">
            <Footer colorText="white" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;




  // "doctor": {
  //       "id": 48,
  //       "firstname": "Muhammad",
  //       "lastname": "Talha",
  //       "cin": null,
  //       "country_code": null,
  //       "phoneNumber": "3078810314",
  //       "gender": null,
  //       "email": "taltude49@gmail.com",
  //       "avatar_doctor": null,
  //       "matricule": "42424242424",
  //       "about": null,
  //       "specialite": null,
  //       "verified": 0,
  //       "nom_cabinet": null,
  //       "premium": 1,
  //       "address_cabinet": null,
  //       "day_debut_work": null,
  //       "day_fin_work": null,
  //       "time_debut_work": null,
  //       "time_fin_work": null,
  //       "appointment_time": null,
  //       "available": 1,
  //       "email_verified_at": null,
  //       "qualifications": null,
  //       "experience_years": null,
  //       "satisfaction_percentage": null,
  //       "created_at": "2025-03-01T14:36:33.000000Z",
  //       "updated_at": "2025-03-01T14:36:33.000000Z"
  //   },