import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRightEndOnRectangleIcon, 
  UserIcon, 
  EnvelopeIcon, 
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/solid";
import { get, remove } from "../../../Services/LocalStorageService";
import axiosClient from "../../../AxiosClient";
import { useDispatch } from "react-redux";
import { logout as UserLogout } from "../../../Redux/SliceAuthUser";

const SidebarLink = ({ to, icon: Icon, label, onClick, isCollapsed }) => (
  <li>
    <Link 
      to={to} 
      className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
      onClick={onClick}
    >
      {Icon && <Icon className="w-[1.3rem] h-[1.3rem] text-gray-500 transition duration-75 group-hover:text-gray-900" />}
      <span className={`ml-3 ${isCollapsed ? "hidden" : "block"}`}>{label}</span>
    </Link>
  </li>
);

const SidebarDropdown = ({ label, icon: Icon, children, isCollapsed, mobileClose }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100"
      >
        {Icon && <Icon className="w-[1.3rem] h-[1.3rem] text-gray-500 transition duration-75 group-hover:text-gray-900" />}
        <span className={`flex-1 ml-3 text-left whitespace-nowrap ${isCollapsed ? "hidden" : "block"}`}>{label}</span>
        {!isCollapsed && (
          <svg
            className={`w-6 h-6 transform transition-transform ${open ? "rotate-180" : ""}`}
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
        )}
      </button>
      {!isCollapsed && (
        <ul className={`${open ? "py-2 space-y-2" : "hidden py-2 space-y-2"}`}>
          {React.Children.map(children, child => {
            return React.cloneElement(child, { onClick: mobileClose });
          })}
        </ul>
      )}
    </li>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Breakpoint for when to switch to mobile view
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

  const logout = () => {
    setIsLoading(true);
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

  // Close sidebar on mobile when a link is clicked
  const handleMobileClose = () => {
    if (windowWidth < MOBILE_BREAKPOINT) {
      setIsMobileOpen(false);
    }
  };

  // Add print-specific class when printing
  if (isPrinting) {
    return null;
  }

  // Mobile menu button (shown on screens smaller than MOBILE_BREAKPOINT)
  const MobileMenuButton = () => (
    <button
      onClick={toggleMobileMenu}
      className={`fixed z-30 p-2 ml-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ${
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
      <div className="relative flex flex-col flex-1 h-full pt-0 bg-white border-r border-gray-200">
        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 -right-3 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200">
            <ul className="pb-2 space-y-2">
              <SidebarLink 
                to="/admin/dashboard" 
                label="Dashboard" 
                icon={() => (
                  <svg className="w-[1.3rem] h-[1.3rem] text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                )}
                isCollapsed={isCollapsed}
              />

              <SidebarDropdown 
                label="Doctors" 
                icon={() => (
                  <svg className="w-[1.3rem] h-[1.3rem] text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
                isCollapsed={isCollapsed}
              >
                <SidebarLink to="/admin/doctors" label="All Doctors" isCollapsed={isCollapsed} />
                <SidebarLink to="/admin/doctors/noverified" label="Non-Verified Doctors" isCollapsed={isCollapsed} />
              </SidebarDropdown>

              <SidebarLink 
                to="/admin/patients" 
                label="Patients" 
                icon={UserIcon} 
                isCollapsed={isCollapsed}
              />
              <SidebarLink 
                to="/admin/appointments" 
                label="Appointments" 
                icon={() => <EnvelopeIcon className="w-5 h-5 text-gray-500" /> } 
                isCollapsed={isCollapsed}
              />
              <SidebarLink 
                to="/admin/payments" 
                label="Payments" 
                icon={() => <CurrencyDollarIcon className="w-5 h-5 text-gray-500" /> } 
                isCollapsed={isCollapsed}
              />
            </ul>

            <div className="pt-2 space-y-2">
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
        className={`fixed top-0 left-0 z-20 w-64 h-full pt-16 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200">
            <ul className="pb-2 space-y-2">
              <SidebarLink 
                to="/admin/dashboard" 
                label="Dashboard" 
                icon={() => (
                  <svg className="w-[1.3rem] h-[1.3rem] text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                )}
                onClick={handleMobileClose}
              />

              <SidebarDropdown 
                label="Doctors" 
                icon={() => (
                  <svg className="w-[1.3rem] h-[1.3rem] text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
                mobileClose={handleMobileClose}
              >
                <SidebarLink to="/admin/doctors" label="All Doctors" onClick={handleMobileClose} />
                <SidebarLink to="/admin/doctors/noverified" label="Non-Verified Doctors" onClick={handleMobileClose} />
              </SidebarDropdown>

              <SidebarLink 
                to="/admin/patients" 
                label="Patients" 
                icon={UserIcon} 
                onClick={handleMobileClose}
              />
              <SidebarLink 
                to="/admin/appointments" 
                label="Appointments" 
                icon={() => <EnvelopeIcon className="w-5 h-5 text-gray-500" /> } 
                onClick={handleMobileClose}
              />
              <SidebarLink 
                to="/admin/payments" 
                label="Payments" 
                icon={() => <CurrencyDollarIcon className="w-5 h-5 text-gray-500" /> } 
                onClick={handleMobileClose}
              />
            </ul>

            <div className="pt-2 space-y-2">
              <div className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100">
                <ArrowRightEndOnRectangleIcon className="w-6 h-6 text-gray-500" />
                <button
                  className="ml-3 disabled:opacity-50"
                  onClick={() => {
                    logout();
                    handleMobileClose();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Logout"}
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