import React, { useEffect, useState } from "react";
import {
  Square2StackIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  IdentificationIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../AxiosClient";
import { logout } from "../../../Redux/SliceAuthDoctor";
import { useDispatch } from "react-redux";
import { remove } from "../../../Services/LocalStorageService";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Breakpoint for when to switch to mobile view (1024px for tablets)
  const MOBILE_BREAKPOINT = 1024;

  useEffect(() => {
    // Media query listener for print
    const mediaQuery = window.matchMedia('print');
    
    const handlePrintChange = (mq) => {
      setIsPrinting(mq.matches);
    };

    // Handle window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-close mobile menu when resizing to desktop
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        setIsMobileOpen(false);
      }
    };

    // Initial check
    setIsPrinting(mediaQuery.matches);
    
    // Add listeners
    mediaQuery.addListener(handlePrintChange);
    window.addEventListener('resize', handleResize);
    
    return () => {
      mediaQuery.removeListener(handlePrintChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
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
    return null;
  }

  // Mobile menu button (shown on screens smaller than MOBILE_BREAKPOINT)
  const MobileMenuButton = () => (
    <button
      onClick={toggleMobileMenu}
      className={`fixed z-30 p-2 ml-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ${
        windowWidth >= MOBILE_BREAKPOINT ? 'hidden' : 'block'
      }`}
      style={{ top: '1rem', left: '0.5rem' }}
    >
      {isMobileOpen ? (
        <XMarkIcon className="w-6 h-6" />
      ) : (
        <Bars3Icon className="w-6 h-6" />
      )}
    </button>
  );

  // Desktop sidebar (shown on screens larger than MOBILE_BREAKPOINT)
  const DesktopSidebar = () => (
    <aside
      className={`hidden lg:flex fixed top-0 left-0 z-20 flex-col h-full pt-16 transition-all duration-300 ease-in-out ${
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

  // Mobile sidebar (shown on screens smaller than MOBILE_BREAKPOINT when toggled)
  const MobileSidebar = () => (
    <div
      className={`fixed inset-0 z-10 bg-gray-900 bg-opacity-50 transition-opacity ${
        isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${windowWidth >= MOBILE_BREAKPOINT ? 'hidden' : 'block'}`}
      onClick={toggleMobileMenu}
    >
      <div
        className={`fixed top-0 left-0 z-20 w-64 h-full pt-16 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out dark:bg-gray-800 dark:border-gray-700 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <ul className="pb-2 space-y-2">
              <li>
                <Link
                  to="/doctor/dashboard"
                  className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={toggleMobileMenu}
                >
                  <Square2StackIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/doctor/rendezvous"
                  className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={toggleMobileMenu}
                >
                  <CalendarDaysIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className="ml-3">Appointments</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/doctor/settings"
                  className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={toggleMobileMenu}
                >
                  <Cog6ToothIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className="ml-3">Settings</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/doctor/about-me"
                  className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={toggleMobileMenu}
                >
                  <IdentificationIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className="ml-3">About Me</span>
                </Link>
              </li>
            </ul>

            <div className="pt-2 space-y-2" style={{ marginTop: "14rem" }}>
              <div className="flex items-center p-2 text-base cursor-pointer text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700">
                <ArrowRightOnRectangleIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                <button
                  onClick={() => {
                    Logout();
                    toggleMobileMenu();
                  }}
                  className="ml-3"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileMenuButton />
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;