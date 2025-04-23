import React, { useEffect, useState } from "react";

import {
  Square2StackIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  IdentificationIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../AxiosClient";
import { logout } from "../../../Redux/SliceAuthDoctor";
import { useDispatch } from "react-redux";
import { remove } from "../../../Services/LocalStorageService";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Media query listener for print
    const mediaQuery = window.matchMedia('print');
    
    const handlePrintChange = (mq) => {
      setIsPrinting(mq.matches);
    };

    // Initial check
    setIsPrinting(mediaQuery.matches);
    
    // Add listener (for browsers that support it)
    mediaQuery.addListener(handlePrintChange);
    
    return () => {
      mediaQuery.removeListener(handlePrintChange);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const Logout = () => {
    axiosClient
      .post("/doctor/logout")
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(logout());
          remove("TOKEN_DOCTOR");
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Add print-specific class when printing
  if (isPrinting) {
    return null; // Or render alternative content for print if needed
  }


  return (
    <aside
      className={`print:hidden fixed top-0 left-0 z-20 flex flex-col h-full pt-16 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="relative flex flex-col flex-1 h-full pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 -right-3 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <ul className="pb-2 space-y-2">
              <li>
                <Link
                  to="/doctor/dashboard"
                  className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <Square2StackIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className={`ml-3 ${isCollapsed ? "hidden" : "block"}`}>
                    Dashboard
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/doctor/rendezvous"
                  className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <CalendarDaysIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className={`ml-3 ${isCollapsed ? "hidden" : "block"}`}>
                    Appointments
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/doctor/settings"
                  className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <Cog6ToothIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className={`ml-3 ${isCollapsed ? "hidden" : "block"}`}>
                    Settings
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/doctor/about-me"
                  className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <IdentificationIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className={`ml-3 ${isCollapsed ? "hidden" : "block"}`}>
                    About Me
                  </span>
                </Link>
              </li>
            </ul>

            <div className="pt-2 space-y-2" style={{ marginTop: "14rem" }}>
              <div className="flex items-center p-2 text-base cursor-pointer text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700">
                <ArrowRightOnRectangleIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <button
                  onClick={Logout}
                  className={`ml-3 ${isCollapsed ? "hidden" : "block"}`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;