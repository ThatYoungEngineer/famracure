import { Spinner } from "flowbite-react";
import axiosClient from "../../../AxiosClient";
import React, { useEffect, useState } from "react";

const TableDashboard = () => {

  const [totalDoctors, setTotalDoctors] = useState(null);
  const [totalPatients, setTotalPatients] = useState(null);
  const [totalPayments, setTotalPayments] = useState(null);
  const [totalAppointments, setTotalAppointments] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      fetchTotalDoctors(),
      fetchTotalPatients(),
      fetchTotalPayments(),
      fetchTotalAppointments(),
    ]).finally(() => setIsLoading(false));
  }, []);

  const fetchTotalDoctors = () => {
    return axiosClient.get(`/admin/doctors`).then((res) => {
      setTotalDoctors(res?.data?.total);
    });
  };

  const fetchTotalAppointments = () => {
    return axiosClient.get(`/admin/appointments`).then((res) => {
      setTotalAppointments(res?.data?.total);
    });
  };

  const fetchTotalPatients = () => {
    return axiosClient.get(`/admin/patient`).then((res) => {
      console.log("psteints: ", res);
      setTotalPatients(res?.data?.patients?.total);
    });
  };

  const fetchTotalPayments = () => {
    return axiosClient.get(`/admin/payments`).then((res) => {
      setTotalPayments(res?.data?.total_payments);
    });
  };

  return (
    <>
      <div className="p-4 md:p-8 bg-white rounded-lg border my-4 md:my-8 mx-2 md:mx-4">
        <div className="mb-4">
          <div>
            <h3 className="text-gray-900 font-semibold text-lg md:text-xl mb-2">
              Dashboard Stats
            </h3>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-10">
            <div className="w-full md:flex-1 flex items-center justify-center gap-3 flex-col mb-6 text-base md:text-lg text-pink-700 bg-pink-100 px-4 md:px-10 py-4 md:py-6 rounded-lg">
              <h2>Total Doctors</h2>
              {isLoading ? <Spinner /> : <h2>{totalDoctors || 0}</h2>}
            </div>
            <div className="w-full md:flex-1 flex items-center justify-center gap-3 flex-col mb-6 text-base md:text-lg text-purple-700 bg-purple-100 px-4 md:px-10 py-4 md:py-6 rounded-lg">
              <h2>Total Patients</h2>
              {isLoading ? <Spinner /> : <h2>{totalPatients || 0}</h2>}
            </div>
            <div className="w-full md:flex-1 flex items-center justify-center gap-3 flex-col mb-6 text-base md:text-lg text-orange-700 bg-orange-100 px-4 md:px-10 py-4 md:py-6 rounded-lg">
              <h2>Total Appointments</h2>
              {isLoading ? <Spinner /> : <h2>{totalAppointments || 0}</h2>}
            </div>
          </div>
            <div className="w-full flex items-center justify-center gap-3 flex-col mb-6 text-base md:text-lg text-green-700 bg-green-100 px-4 md:px-10 py-4 md:py-6 rounded-lg">
              <h2>Total Payments</h2>
              {isLoading ? <Spinner /> : <h2>{totalPayments || 0}</h2>}
            </div>
        </div>
      </div>

    </>
  );
};

export default TableDashboard;
