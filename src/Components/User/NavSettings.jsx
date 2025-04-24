import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  CalendarIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/20/solid";

const NavSettings = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia('print');
    const handlePrintChange = (mq) => setIsPrinting(mq.matches);
    
    setIsPrinting(mediaQuery.matches);
    mediaQuery.addListener(handlePrintChange);
    
    return () => mediaQuery.removeListener(handlePrintChange);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isPrinting) return null;

  const navItems = [
    {
      path: "/user/profile",
      icon: <UserCircleIcon className="w-5 h-5" />,
      label: "Profile",
      collapsedLabel: "P"
    },
    {
      path: "/user/settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      label: "Account Settings",
      collapsedLabel: "A"
    },
    {
      path: "/user/booked-appointments",
      icon: <CalendarIcon className="w-5 h-5" />,
      label: "Appointments",
      collapsedLabel: "A"
    },
    {
      path: "/user/prescriptions",
      icon: <DocumentTextIcon className="w-5 h-5" />,
      label: "Prescriptions",
      collapsedLabel: "Rx"
    }
  ];

  return (
    <aside 
      className={` pb-10 relative h-fit bg-gradient-to-b from-blue-50 to-white ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out shadow-lg`}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-6 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-blue-50 z-10 transition-all duration-200 hover:scale-110"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4 text-blue-600" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4 text-blue-600" />
        )}
      </button>

      <div className="h-full flex flex-col pt-8">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center mb-8'}`}>
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-blue-800">User Menu</h2>
          )}
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-blue-100 text-blue-700 font-medium shadow-inner'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  } ${
                    isCollapsed ? 'justify-center' : 'justify-start space-x-3'
                  }`}
                >
                  <span className={`${location.pathname === item.path ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default NavSettings;