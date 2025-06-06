import React, { useState } from "react";
import AnnulerModel from "../Includes/AnnulerModel";
import AjouterModel from "./AjouterModel";
import TableAppointment from "./TableAppointment";
import { Link } from "react-router-dom";

const ListOfAppointment = () => {
  const [show, setShow] = useState(false);
  const [showAnnuler, setShowAnnuler] = useState(false);
  const [idAppointment, setIdAppointment] = useState(null);


  const [refreshApp, setRefreshApp] = useState(false);

  const AnnulerAppointment = (idAppointment) => {
    console.log(idAppointment);
    setShowAnnuler(!showAnnuler);
    setIdAppointment(null);
  };

  return (
    <>
      <div className="p-3 md:p-4 bg-gray-50 block border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full mb-1">
          {/* Header of Page  */}

          <div className="mb-3 md:mb-4">
            <nav className="flex flex-wrap mb-3 md:mb-5" aria-label="Breadcrumb">
              <ol className="inline-flex flex-wrap items-center space-x-1 text-xs sm:text-sm font-medium md:space-x-2">
                <li className="inline-flex items-center">
                  <Link
                    to="/doctor/dashboard"
                    className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white"
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <Link
                      to="#"
                      className="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white"
                    >
                      Appointments
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span
                      className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500"
                      aria-current="page"
                    >
                      List
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
            All Appointments
            </h1>
          </div>

          {/* End Header Of page */}

          <div className="flex justify-end">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                type="button"
                className="inline-flex items-center justify-center w-full px-3 py-2 text-xs sm:text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={() => setShow(!show)}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 -ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Add Appointment
              </button>
            </div>
            {/* ENd Button Add Apointment */}
          </div>
        </div>
      </div>

      {/* Component Table  Appointment */}
      <TableAppointment
        showAnnuler={showAnnuler}
        setShowAnnuler={setShowAnnuler}
        setIdAppointment={setIdAppointment}
        AnnulerAppointment={AnnulerAppointment}
        refreshApp={refreshApp}
      />

      {/* Component Add New Appointment */}
      <AjouterModel show={show} setShow={setShow} refreshApp={setRefreshApp} />

      {/* Component Annuler Apointment */}
      <AnnulerModel
        showAnnuler={showAnnuler}
        setShowAnnuler={setShowAnnuler}
        AnnulerAppointment={AnnulerAppointment}
        idAppointment={idAppointment}
      />
    </>
  );
};

export default ListOfAppointment;
