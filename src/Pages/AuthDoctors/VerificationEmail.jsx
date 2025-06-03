import React, { useState } from "react";
import { Footer, Header } from "../../Components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../AxiosClient";
import AlertSucces from "../../Components/Alert/AlertSucces";
import { remove } from "../../Services/LocalStorageService";
import { logout } from "../../Redux/SliceAuthDoctor";

const VerificationEmail = () => {
  document.title = "Verify Email";

  const doctorData = useSelector((state) => state.AuthDoctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ShowAlertSucce, setShowAlertSucce] = useState(false);

  const ResendVerificationEmail = () => {
    console.log(doctorData.doctor.id);
    axiosClient
      .get(`/doctors/email/resend/${doctorData.doctor.id}`)
      .then(() => {
        setShowAlertSucce(!ShowAlertSucce);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleLogout = () => {
    axiosClient
      .post("/doctor/logout")
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(logout());
          remove("TOKEN_DOCTOR");
          navigate("/doctor/signup");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="absolute w-full min-h-screen img_bg">
        <div className="relative bg-black bg-opacity-75 min-h-screen">
          <Header />
          <main className="min-h-[80vh] flex justify-center items-center px-4">
            <div className="bg-slate-100 w-full sm:w-[80%] md:w-[60%] lg:w-[40%] p-4 rounded-lg">
              <div className="w-full px-2 sm:px-5 text-center">
                <h2 className="mb-2 text-xl sm:text-[23px] font-bold text-zinc-800">
                  Check your Email
                </h2>
                <p className="mb-2 text-sm sm:text-[16px] text-zinc-500">
                  We are glad that you're with us! We've sent you a
                  verification link to the email address{" "}
                  <span className="font-medium text-indigo-500 break-all">
                    {doctorData.doctor && doctorData.doctor.email}
                  </span>
                  .
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center">
                  <button
                    onClick={ResendVerificationEmail}
                    className="mt-3 inline-block text-sm sm:text-[16px] w-full sm:w-72 rounded bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
                  >
                    Resend Verification →
                  </button>
                  <button
                    onClick={HandleLogout}
                    className="mt-3 sm:ml-7 px-4 w-full sm:w-auto text-sm sm:text-[14px] font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </main>
          <Footer colorText="white" />
        </div>
      </div>
      {ShowAlertSucce && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <AlertSucces Message={"link Verification email send Success"} />
        </div>
      )}
    </>
  );
};

export default VerificationEmail;
