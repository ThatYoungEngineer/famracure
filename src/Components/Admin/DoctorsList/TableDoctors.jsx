import { CheckCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import AxiosClient from "../../../AxiosClient";
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
                          <td className="p-4 text-[14px] font-normal text-gray-500">{el.cin ?? "NULL"}</td>
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
                          <td className="p-4">
                          <button
                            disabled={el.verified === 1 || (LoadingButton.loading && LoadingButton.id === el.id)}
                            className={`flex items-center justify-center p-2 text-[14px] font-medium text-white rounded-lg ${
                              el.verified === 1 ? "bg-gray-400" : "bg-primary-600 hover:bg-primary-800"
                            }`}
                            onClick={() => VerifierDoctor(el.id, el.verified)}
                          >
                            {LoadingButton.loading && LoadingButton.id === el.id ? (
                              <Spinner size="sm" className="mr-2" />
                            ) : (
                              <CheckCircleIcon className="w-[1.2rem] h-[1.2rem] mr-2" />
                            )}
                            {el.verified === 1 ? "Verified" : "Verify Now"}
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
