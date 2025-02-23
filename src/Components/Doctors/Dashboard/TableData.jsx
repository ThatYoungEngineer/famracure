import React, { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import AnnulerModel from "../Includes/AnnulerModel";
import axiosClient from "../../../AxiosClient";
import { useSelector } from "react-redux";

const TableDashboard = () => {
  const [showAnnuler, setShowAnnuler] = useState(false);
  const doctorData = useSelector((state) => state.AuthDoctor);
  const adminData = useSelector((state) => state.AuthAdmin); // Fixed reference
  const [appointmentToday, setAppointmentToday] = useState([]);
  const [idAppointment, setIdAppointment] = useState(null);

  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const AnnulerAppointment = (idAppointment) => {
    console.log("Cancelling appointment ID:", idAppointment);
    setShowAnnuler(!showAnnuler);
    setIdAppointment(null);
  };

  useEffect(() => {
    if (doctorData?.doctor) {
      setIsLoading(true);
      // Fetch appointments for doctors
      axiosClient
        .get(`/doctor/appointmenttoday/${doctorData.doctor.id}`)
        .then((res) => {
          setAppointmentToday(res?.data || []);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    } else if (adminData?.admin) {
      // Fetch users for admins
      setIsLoading(true);
      axiosClient
        .get("/user/getAll")
        .then((res) => {
          setUsers(res?.data?.users || []);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [doctorData, adminData]);

  return (
    <>
      <div className="p-8 bg-white rounded-lg border mb-2 mt-8 mx-4">
        <div className="justify-between items-center flex mb-4">
          <div>
            <h3 className="text-gray-900 font-semibold text-xl mb-2">
              {doctorData?.doctor ? "Today's Appointments" : "User Signups"}
            </h3>
            <span className="text-gray-500 font-normal text-base">
              {doctorData?.doctor
                ? "This is a list of today's appointments."
                : "This is a list of the latest users."}
            </span>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {/* Display Data */}
        {!isLoading && (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          {doctorData?.doctor ? "Nom & Prenom" : "User Name"}
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          {doctorData?.doctor ? "Cin" : "Email"}
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          Phone Number
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          {doctorData?.doctor ? "Appointment Date" : "Created At"}
                        </th>
                        {doctorData?.doctor && (
                          <>
                            <th
                              scope="col"
                              className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                            >
                              Hour
                            </th>
                            <th scope="col" className="p-4"></th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {doctorData?.doctor &&
                        appointmentToday.map((el, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <td className="flex items-center p-4 space-x-6 whitespace-nowrap">
                              <div className="text-[14px] font-semibold text-gray-900 dark:text-white">
                                {el.user.firstname + " " + el.user.lastname}
                              </div>
                            </td>
                            <td className="p-4 text-[14px] font-normal text-gray-500 dark:text-gray-400">
                              {el.user.cin}
                            </td>
                            <td className="p-4 text-[14px] font-medium text-gray-900 dark:text-white">
                              {el.user.phoneNumber || ""}
                            </td>
                            <td className="p-4 text-[14px] font-normal text-gray-900 dark:text-white">
                              {el.date_appointment}
                            </td>
                            <td className="p-4 text-[14px] font-medium text-gray-900 dark:text-white">
                              {el.time_appointment}
                            </td>
                            <td className="p-4">
                              <button
                                type="button"
                                className="inline-flex items-center px-2 py-1.5 text-[14px] font-medium text-white bg-red-600 rounded-lg hover:bg-red-800"
                                onClick={() => {
                                  setIdAppointment(idx);
                                  setShowAnnuler(!showAnnuler);
                                }}
                              >
                                <XCircleIcon className="w-4 h-4 mr-2" />
                                Annuler
                              </button>
                            </td>
                          </tr>
                        ))}

                      {adminData?.admin &&
                        users?.map((user, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <td className="p-4 text-[14px] font-normal text-gray-900 dark:text-white">
                              {user?.firstname + " " + user.lastname}
                            </td>
                            <td className="p-4 text-[14px] font-normal text-gray-500 dark:text-gray-400">
                              {user.email}
                            </td>
                            <td className="p-4 text-[14px] font-normal text-gray-900 dark:text-white">
                              {user.phone_number}
                            </td>
                            <td className="p-4 text-[14px] font-normal text-gray-500 dark:text-gray-400">
                              {user.created_at}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {/* Empty State */}
                  {((doctorData?.doctor && appointmentToday.length === 0) ||
                    (adminData?.admin && users?.length === 0)) && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No data available.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Annuler Appointment Modal */}
      <AnnulerModel
        showAnnuler={showAnnuler}
        setShowAnnuler={setShowAnnuler}
        AnnulerAppointment={AnnulerAppointment}
        idAppointment={idAppointment}
      />
    </>
  );
};

export default TableDashboard;
