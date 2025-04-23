import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, PrinterIcon } from "@heroicons/react/24/outline";

const NavSettings = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('print');
    const handlePrintChange = (mq) => setIsPrinting(mq.matches);
    
    // Initial check
    setIsPrinting(mediaQuery.matches);
    mediaQuery.addListener(handlePrintChange);
    
    return () => mediaQuery.removeListener(handlePrintChange);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isPrinting) return null;

  return (
    <aside 
      className={`relative my-4 ${isCollapsed ? 'w-16' : 'w-[25%]'} border-r-[#EFEFFF] border-r-2 h-[29vh] transition-all duration-300`}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 z-10"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <ul className={`${isCollapsed ? 'w-full px-2' : 'w-[65%]'} overflow-hidden`}>
        <li className="text-sm w-full my-3 flex">
          <Link
            className={`py-2 px-4 w-full border-2 border-[#FFFFFF] hover:bg-[#FCFCFF] hover:border-[#EFEFFF] hover:rounded-full flex items-center ${
              isCollapsed ? 'justify-center' : ''
            }`}
            to="/user/profile"
          >
            {isCollapsed ? (
              <span className="text-xs">P</span>
            ) : (
              "Profile"
            )}
          </Link>
        </li>

        <li className="text-sm w-full my-3 flex">
          <Link
            className={`py-2 px-4 w-full border-2 border-[#FFFFFF] hover:bg-[#FCFCFF] hover:border-[#EFEFFF] hover:rounded-full flex items-center ${
              isCollapsed ? 'justify-center' : ''
            }`}
            to="/user/settings"
          >
            {isCollapsed ? (
              <span className="text-xs">A</span>
            ) : (
              "Account settings"
            )}
          </Link>
        </li>

        <li className="text-sm w-full my-3 flex">
          <Link
            className={`py-2 px-4 w-full border-2 border-[#FFFFFF] hover:bg-[#FCFCFF] hover:border-[#EFEFFF] hover:rounded-full flex items-center ${
              isCollapsed ? 'justify-center' : ''
            }`}
            to="/user/booked-appointments"
          >
            {isCollapsed ? (
              <span className="text-xs">B</span>
            ) : (
              "Booked Appointments"
            )}
          </Link>
        </li>

        <li className="text-sm w-full my-3 flex">
          <Link
            className={`py-2 px-4 w-full border-2 border-[#FFFFFF] hover:bg-[#FCFCFF] hover:border-[#EFEFFF] hover:rounded-full flex items-center ${
              isCollapsed ? 'justify-center' : ''
            }`}
            to="/user/prescriptions"
          >
            {isCollapsed ? (
              <span className="text-xs">Rx</span>
            ) : (
              "Prescriptions"
            )}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default NavSettings;