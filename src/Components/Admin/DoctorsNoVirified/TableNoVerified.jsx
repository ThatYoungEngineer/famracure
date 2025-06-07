import { CheckCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import AxiosClient from "../../../AxiosClient";
import axiosClient from "../../../AxiosClient";
import { Button, Spinner } from "flowbite-react";

const TableNoVerified = ({ setShowAlertSucces }) => {
  const [Doctors, setDoctors] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [LoadingButton, setLoadingButton] = useState({ loading: false, id: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(null)

  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage]);

  const fetchDoctors = (page) => {
    setLoading(true);
    AxiosClient.get(`/admin/doctors?page=${page}`)
      .then((res) => {
        setDoctors(res?.data?.data);
        setCurrentPage(res?.data?.current_page);
        setLastPage(res?.data?.last_page);
        setTotalDocs(res?.data?.total);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const VerifierDoctor = (doctor_id, verified) => {
    setLoadingButton({ id: doctor_id, loading: true });

    axiosClient
      .post("/admin/doctor/verification", { doctor_id, verified: 1 })
      .then((res) => {
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor.id === doctor_id ? { ...doctor, verified: 1 } : doctor
          )
        );
        setShowAlertSucces(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingButton({ id: 0, loading: false });
      });
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-center sm:justify-start gap-10">
          <div className="flex items-center justify-center gap-3 flex-col mb-6 text-lg text-green-700 bg-green-100 w-fit px-6 sm:px-10 py-4 sm:py-6 rounded-lg">
            <h2>Total Doctors</h2>
            {Loading ? <Spinner /> : <h2>{totalDocs}</h2>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="w-full align-middle">
            <div className="overflow-hidden shadow">
              {!Loading ? (
                <>
                  {/* Desktop view - Table */}
                  <div className="hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">First Name & Last Name</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Matricule</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Phone Number</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Email</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Status</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Doctors && Doctors.filter((el) => el.verified === 0).length > 0 ? (
                          Doctors.filter((el) => el.verified === 0).map((el, idx) => (
                            <tr key={idx} className="hover:bg-gray-100">
                              <td className="p-4 text-[14px] font-semibold text-gray-900">{el.firstname + " " + el.lastname}</td>
                              <td className="p-4 text-[14px] font-normal text-gray-500">{el.cin ?? "NULL"}</td>
                              <td className="p-4 text-[14px] font-medium text-gray-900">{el.phoneNumber}</td>
                              <td className="p-4 text-[14px] font-medium text-gray-900">{el.email}</td>
                              <td className="p-4 text-[14px] font-normal text-gray-900">
                                <div className="flex gap-1 items-center text-red-500">
                                  <span className="w-2 h-2 rounded-full bg-red-400" />
                                  Not Verified
                                </div>
                              </td>
                              <td className="p-4">
                                <button
                                  disabled={LoadingButton.loading && LoadingButton.id === el.id}
                                  className="flex items-center justify-center p-2 text-[14px] font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-800"
                                  onClick={() => VerifierDoctor(el.id, el.verified)}
                                >
                                  {LoadingButton.loading && LoadingButton.id === el.id ? (
                                    <Spinner size="sm" className="mr-2" />
                                  ) : (
                                    <CheckCircleIcon className="w-[1.2rem] h-[1.2rem] mr-2" />
                                  )}
                                  Verify Now
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="p-4 text-center text-gray-500">
                              No unverified doctors found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile view - Cards */}
                  <div className="md:hidden">
                    {Doctors && Doctors.filter((el) => el.verified === 0).length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {Doctors.filter((el) => el.verified === 0).map((el, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">{el.firstname + " " + el.lastname}</h3>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Matricule:</span>
                                <span className="text-sm text-gray-900">{el.cin ?? "NULL"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Phone:</span>
                                <span className="text-sm text-gray-900">{el.phoneNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Email:</span>
                                <span className="text-sm text-gray-900 break-all">{el.email}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">Status:</span>
                                <div className="flex gap-1 items-center text-red-500">
                                  <span className="w-2 h-2 rounded-full bg-red-400" />
                                  <span className="text-sm">Not Verified</span>
                                </div>
                              </div>
                            </div>
                            <button
                              disabled={LoadingButton.loading && LoadingButton.id === el.id}
                              className="w-full flex items-center justify-center p-2 text-[14px] font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-800"
                              onClick={() => VerifierDoctor(el.id, el.verified)}
                            >
                              {LoadingButton.loading && LoadingButton.id === el.id ? (
                                <Spinner size="sm" className="mr-2" />
                              ) : (
                                <CheckCircleIcon className="w-[1.2rem] h-[1.2rem] mr-2" />
                              )}
                              Verify Now
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow">
                        No unverified doctors found.
                      </div>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6 px-4 sm:px-0">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm sm:text-base py-2">Page {currentPage} of {lastPage}</span>
                    <Button 
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={currentPage === lastPage}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-[40vh] sm:h-[70vh] w-full">
                  <span className="text-base sm:text-lg font-semibold text-gray-600"><Spinner size='md' className="sm:hidden" /><Spinner size='lg' className="hidden sm:inline-block" /> </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default TableNoVerified;
