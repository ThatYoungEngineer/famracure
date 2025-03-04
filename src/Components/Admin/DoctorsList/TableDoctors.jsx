import { CheckCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../AxiosClient";
import { Button, Spinner } from "flowbite-react";

const TableDoctors = ({ setShowAlertSucces }) => {
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
    axiosClient.get(`/admin/doctors?page=${page}`)
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
      .post("/admin/doctor/verification", { doctor_id, verified })
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

  const handleDeleteUser = (user) => {}


  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center gap-10">
          <div className="flex-1 flex items-center justify-center gap-3 flex-col mb-6 text-lg text-green-700 bg-green-100 w-fit px-10 py-6 rounded-lg">
            <h2>Total Doctors</h2>
            {Loading ? <Spinner /> : <h2>{totalDocs}</h2>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              {!Loading ? (
                <>
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
                      {(Doctors && Doctors?.length > 0) && Doctors?.map((el, idx) => (
                        <tr key={idx} className="hover:bg-gray-100">
                          <td className="p-4 text-[14px] font-semibold text-gray-900">{el.firstname + " " + el.lastname}</td>
                          <td className="p-4 text-[14px] font-normal text-gray-500">{el.matricule ?? "NULL"}</td>
                          <td className="p-4 text-[14px] font-medium text-gray-900">{el.phoneNumber}</td>
                          <td className="p-4 text-[14px] font-medium text-gray-900">{el.email}</td>
                          <td className="p-4 text-[14px] font-normal text-gray-900">
                            {el.verified === 1 ? (
                              <div className="flex items-center text-green-500 gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400 "/>
                                Verified
                              </div>
                            ) : (
                              <div className="flex gap-1 items-center text-red-500">
                                <span className="w-2 h-2 rounded-full bg-red-400 "/>
                                Not Verified
                              </div>
                            )}
                          </td>
                          <td className="p-4 flex items-center gap-2">
                            <button
                              disabled={el.verified === 1 || (LoadingButton.loading && LoadingButton.id === el.id)}
                              className={` w-32 flex items-center gap-2 p-2 text-[14px] font-medium text-white rounded-lg ${
                                el.verified === 1 ? "bg-gray-400" : "bg-primary-600 hover:bg-primary-800"
                              }`}
                              onClick={() => VerifierDoctor(el.id, el.verified)}
                            >
                              {LoadingButton.loading && LoadingButton.id === el.id ? (
                                <Spinner size="sm" />
                              ) : (
                                <CheckCircleIcon className="w-[1.2rem] h-[1.2rem]" />
                              )}
                              {el.verified === 1 ? "Verified" : "Verify Now"}
                            </button>
                            <button
                              type="button"
                              className='flex items-center justify-center gap-2 p-2 text-[14px] font-medium text-red-100 rounded-lg bg-red-600 hover:bg-red-800'
                              onClick={() => handleDeleteUser(el)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                   <div className="flex justify-center items-center gap-4 mt-6">
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Previous
                    </Button>
                    <span>Page {currentPage} of {lastPage}</span>
                    <Button 
                      disabled={currentPage === lastPage}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-[70vh] w-full">
                  <span className="text-lg font-semibold text-gray-600"><Spinner size='lg' /> </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableDoctors;
