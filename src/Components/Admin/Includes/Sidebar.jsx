import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightEndOnRectangleIcon, UserIcon, EnvelopeIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { get, remove } from "../../../Services/LocalStorageService";
import axiosClient from "../../../AxiosClient";
import { useDispatch } from "react-redux";
import { logout as UserLogout } from "../../../Redux/SliceAuthUser";

const SidebarLink = ({ to, icon: Icon, label }) => (
  <li>
    <Link to={to} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
      {Icon && <Icon className="w-[1.3rem] h-[1.3rem] text-gray-500 transition duration-75 group-hover:text-gray-900" />}
      <span className="ml-3">{label}</span>
    </Link>
  </li>
);

const SidebarDropdown = ({ label, icon: Icon, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
      >
        {Icon && <Icon className="w-[1.3rem] h-[1.3rem] text-gray-500 transition duration-75 group-hover:text-gray-900" />}
        <span className="flex-1 ml-3 text-left whitespace-nowrap">{label}</span>
        <svg
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
      <ul className={`${open ? "py-2 space-y-2" : "hidden py-2 space-y-2"}`}>{children}</ul>
    </li>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const logout = () => {
    if (get("TOKEN_ADMIN")) {
      axiosClient
        .post("/user/logout")
        .then((res) => {
          if (res.data.success && res.status === 200) {
            dispatch(UserLogout());
            remove("TOKEN_ADMIN");
          }
        })
        .catch(console.log)
        .finally(() => {
          setIsLoading(false);
          navigate("/");
        });
    } else {
      setIsLoading(false);
      navigate("/");
    }
  };

  return (
    <aside
      className={`fixed top-16 left-0 z-40 border-t h-screen overflow-y-auto border-r border-gray-200 transition-transform bg-white ${
        isCollapsed ? "w-7" : "w-64"
      }`}
    >
      <div className="flex justify-end p-2">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-sm text-gray-500">
          {isCollapsed ? "➡️" : "⬅️"}
        </button>
      </div>
      <div className="h-full px-3 overflow-y-auto">
        <ul className="space-y-2 font-medium text-[18px]">
          <SidebarLink to="/admin/dashboard" label="Dashboard" icon={() => (
            <svg className="w-[1.3rem] h-[1.3rem] text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
          )} />

          <SidebarDropdown label="Doctors" icon={() => (
            <svg className="w-[1.3rem] h-[1.3rem] text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}>
            <SidebarLink to="/admin/doctors" label="All Doctors" />
            <SidebarLink to="/admin/doctors/noverified" label="Non-Verified Doctors" />
          </SidebarDropdown>

          <SidebarLink to="/admin/patients" label="Patients" icon={UserIcon} />
          <SidebarLink to="/admin/appointments" label="Appointments" icon={() => <EnvelopeIcon className="w-5 h-5 text-gray-500" /> } />
          <SidebarLink to="/admin/payments" label="Payments" icon={() => <CurrencyDollarIcon className="w-5 h-5 text-gray-500" /> } />
        </ul>

        <div className="absolute bottom-20 w-full pr-4">
          <div className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100">
            <ArrowRightEndOnRectangleIcon className="w-6 h-6 text-gray-500" />
            {!isCollapsed && (
              <button
                className="ml-3 disabled:opacity-50"
                onClick={logout}
                disabled={isLoading}
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
