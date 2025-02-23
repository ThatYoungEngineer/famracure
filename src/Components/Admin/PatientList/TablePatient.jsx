import { XCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../AxiosClient";
import { Button, Spinner } from "flowbite-react";

const TablePatient = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState(null);

  useEffect(() => {
    fetchPatients(currentPage);
    fetchPatientStatus()
  }, [currentPage]);

  const fetchPatients = async (page) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/admin/patient?page=${page}`);
      setPatients(response?.data?.patients?.data || []);
      setLastPage(response?.data?.patients?.last_page || 1);
      setTotalPatients(response?.data?.patients?.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPatientStatus = async () => {
    try {
      const response = await axiosClient.get(`/admin/appointments`);
      console.log('patient status: ' + response)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center gap-10">
          <div className="flex-1 flex items-center justify-center gap-3 flex-col mb-6 text-lg text-green-700 bg-green-100 w-fit px-10 py-6 rounded-lg">
            <h2>Total Patients</h2>
            {loading ? <Spinner /> : <h2>{totalPatients}</h2>}
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              {loading ? (
                <div className="flex justify-center py-4 h-96 items-center">
                  <Spinner size="lg" />
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Name</th>
                      <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Email</th>
                      <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Cin</th>
                      <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Phone Number</th>
                      <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Active</th>
                      <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patients.length > 0 ? (
                      patients.map((el, idx) => (
                        <tr key={idx} className="hover:bg-gray-100">
                          <td className="p-4 text-[14px] font-medium text-gray-900 whitespace-nowrap">
                            {el?.firstname + " " + el.lastname}
                          </td>
                          <td className="p-4 text-[14px] font-normal text-gray-900 whitespace-nowrap">
                            {el?.email}
                          </td>
                          <td className="p-4 text-[14px] font-medium text-gray-900 whitespace-nowrap">
                            {el?.cin}
                          </td>
                          <td className="p-4 text-[14px] font-medium text-gray-900 whitespace-nowrap">
                            {el?.phone_number}
                          </td>
                          <td className="p-4 text-[14px] font-medium text-gray-900 whitespace-nowrap">
                            {el?.active === 0 ? "No" : "Yes"}
                          </td>
                          <td className="p-4 text-[14px] font-medium text-gray-900 whitespace-nowrap">
                            {new Date(el?.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      !loading && (
                        <tr className="h-20">
                          <td colSpan="6" className="text-center italic text-gray-500">
                            No data found
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {lastPage}</span>
        <Button 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
          disabled={currentPage === lastPage}
        >
          Next
        </Button>
      </div>

    </>
  );
};

export default TablePatient;