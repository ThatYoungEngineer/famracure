import React, { useState } from "react";
import { Footer, Header, UserNavSettings } from "../../Components";
import axiosClient from "../../AxiosClient";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const userData = useSelector((state) => state.authUser);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setError("");
      axiosClient
      .post("reset-password/user", 
        { 
          email: userData.user.email, token: userData.userToken, password: password, password_confirmation: confirmPassword 
        }
      )
      .then((res) => {
        console.log("Password changed successfully!", res);
        alert("Password changed successfully!");
      })
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="_container my-8 flex ">
        <UserNavSettings />
        <div className=" w-[75%]  ">
          <div className="ml-7 ">
            <form className=" w-[55%] " onSubmit={handleSubmit}>
              <div className="my-[1.5rem]">
                <label
                  htmlFor="password"
                  className="block mb-1 text-[14px]  font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full   py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Type your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="my-[1.5rem]">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 text-[14px]  font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full   py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              {error && <p className="mt-3 text-red-500 text-[12px]">{error}</p>}
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 text-[12px]  text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 "
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePassword;