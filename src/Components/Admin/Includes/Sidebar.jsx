import React, { useState } from "react";

import { UserIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/20/solid";
import { get, remove } from "../../../Services/LocalStorageService";
import axiosClient from "../../../AxiosClient";
import { useDispatch } from "react-redux";

import { logout as UserLogout } from "../../../Redux/SliceAuthUser";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ShowDropDown, setShowDropDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const logout = () => {
  if (get("TOKEN_ADMIN")) {
    axiosClient
      .post("/user/logout") // Assuming the endpoint for admin logout is "/admin/logout"
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(UserLogout()); // Dispatch the admin logout action
          remove("TOKEN_ADMIN"); // Remove the admin token
        }
      })
      .catch((err) => {
        console.log(err); // Handle any errors
      })
      .finally(() => {
        setIsLoading(false); // Ensure loading state is reset
        navigate("/"); // Navigate to the home page
      });
  } else {
    setIsLoading(false); // If no admin token, reset loading state
    navigate("/"); // Navigate to the home page
  }
};

  return (
    <>
      <div>
        <div className="relative flex flex-col flex-1 min-h-0 pt-0">
          <aside className="fixed top-16 left-0 z-40 border-t w-64 h-screen border-r border-gray-200 transition-transform -translate-x-full sm:translate-x-0">
            <div className="h-full px-3 py-4 overflow-y-auto bg-white  ">
              <ul className="space-y-2 font-medium text-[18px]">
                
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 "
                  >
                    <svg
                      aria-hidden="true"
                      className="w-[1.3rem] h-[1.3rem] text-gray-500 transition duration-75  group-hover:text-gray-900 "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                    </svg>
                    <span className="ml-3">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setShowDropDown(!ShowDropDown)}
                    type="button"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 "
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 w-[1.3rem] h-[1.3rem] text-gray-500 transition duration-75 group-hover:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="flex-1 ml-3 text-left whitespace-nowrap">
                      Doctors
                    </span>
                    <svg
                      sidebar-toggle-item="true"
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <ul
                    className={
                      ShowDropDown ? "py-2 space-y-2" : "hidden py-2 space-y-2"
                    }
                  >
                    <li>
                      <Link
                        to="/admin/doctors"
                        className="flex items-center w-full text-base p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 "
                      >
                        All Doctors
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/doctors/noverified"
                        className="flex items-center w-full text-base p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 "
                      >
                        Non-Verified Doctors
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    to="/admin/patients"
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
                  >
                    <UserIcon className="w-[1.3rem] h-[1.3rem] text-gray-500 transition duration-75  group-hover:text-gray-900 " />
                    <span className="ml-3">Patients</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/appointments"
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500" >
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3">Appointments</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/payments"
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500" >
                      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3">Payments</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/doctor-dashboard"
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500" >
                      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3">Doctor Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/user-dashboard"
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500" >
                      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3">User Dashboard</span>
                  </Link>
                </li>

              </ul>

              <div className="pt-2 space-y-2 absolute bottom-[13%] w-[-webkit-fill-available] pr-[11px] cursor-pointer">
                <div className="flex items-center mt-3 p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700">
                  <ArrowRightEndOnRectangleIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <button
                    className="ml-3 disabled:opacity-50"
                    type="button"
                    onClick={logout}
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging out.." : "Logout"}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
