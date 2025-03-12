import { CheckCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../AxiosClient";
import { Button, Spinner } from "flowbite-react";
import { useNavigate } from "react-router";
import { storeInLocalStorage, remove, get } from "../../../Services/LocalStorageService";


const TableDoctors = ({ setShowAlertSucces }) => {
  const [Doctors, setDoctors] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [LoadingButton, setLoadingButton] = useState({ loading: false, id: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loadingImpersonate, setLoadingImpersonate] = useState(false);

  const ADMIN_TOKEN = get("TOKEN_ADMIN");

  const navigate = useNavigate()

  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage]);

  const fetchDoctors = (page) => {
    setLoading(true);
    axiosClient
      .get(`/admin/doctors?page=${page}`)
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

  // Function to filter doctors based on search query
  const filteredDoctors = Doctors.filter((doctor) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (doctor.firstname + " " + doctor.lastname).toLowerCase().includes(searchLower) ||
      doctor.matricule?.toLowerCase().includes(searchLower) ||
      doctor.phoneNumber.toLowerCase().includes(searchLower) ||
      doctor.email.toLowerCase().includes(searchLower) ||
      (doctor.verified === 1 ? "verified" : "not verified").includes(searchLower)
    );
  });

  const handleImpersonate = (id) => {
    setLoadingImpersonate(true)
    axiosClient
    .post(`/admin/impersonate/doctor/${id}`)
    .then((res) => {
      console.log('res of impersonate: ', res)
      storeInLocalStorage("TOKEN_DOCTOR", ADMIN_TOKEN)
      navigate("/doctor/settings", { state: { userRole: "admin", doctor_id: id } });
    })
    .finally(() => {
      setLoadingImpersonate(false)
    });
  }


  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center gap-10">
          <div className="flex-1 flex items-center justify-center gap-3 flex-col mb-6 text-lg text-green-700 bg-green-100 w-fit px-10 py-6 rounded-lg">
            <h2>Total Doctors</h2>
            {Loading ? <Spinner /> : <h2>{totalDocs}</h2>}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
                      {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((el, idx) => (
                          <tr key={idx} className="hover:bg-gray-100">
                            <td className="p-4 text-[14px] font-semibold text-gray-900">{el.firstname + " " + el.lastname}</td>
                            <td className="p-4 text-[14px] font-normal text-gray-500">{el.matricule ?? "NULL"}</td>
                            <td className="p-4 text-[14px] font-medium text-gray-900">{el.phoneNumber}</td>
                            <td className="p-4 text-[14px] font-medium text-gray-900">{el.email}</td>
                            <td className="p-4 text-[14px] font-normal text-gray-900">
                              {el.verified === 1 ? (
                                <div className="flex items-center text-green-500 gap-1">
                                  <span className="w-2 h-2 rounded-full bg-green-400" />
                                  Verified
                                </div>
                              ) : (
                                <div className="flex gap-1 items-center text-red-500">
                                  <span className="w-2 h-2 rounded-full bg-red-400" />
                                  Not Verified
                                </div>
                              )}
                            </td>
                            <td className="p-4 flex items-center gap-2">
                              <button
                                disabled={el.verified === 1 || (LoadingButton.loading && LoadingButton.id === el.id)}
                                className={`w-32 flex items-center gap-2 p-2 text-[14px] font-medium text-white rounded-lg ${
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
                                className="flex items-center justify-center gap-2 p-2 text-[14px] font-medium text-yellow-100 rounded-lg bg-yellow-600 hover:bg-yellow-800"
                                onClick={() => navigate(`/admin/doctor-dashboard/${el.id}`)}
                                
                              >
                                <svg
                                  aria-hidden="true"
                                  className="w-[1.3rem] h-[1.3rem] text-yellow-100 transition duration-75  group-hover:text-yellow-900 "
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                                </svg>
                                Dashboard
                              </button>
                              <button
                                type="button"
                                className="flex items-center justify-center gap-2 p-2 text-[14px] font-medium text-pink-100 rounded-lg bg-pink-600 hover:bg-pink-800"
                                onClick={() => handleImpersonate(el.id) }
                                disabled={loadingImpersonate}
                                
                              >
                                <svg
                                  aria-hidden="true"
                                  className="w-[1.3rem] h-[1.3rem] text-pink-100 transition duration-75  group-hover:text-pink-900 "
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                                </svg>
                                  {loadingImpersonate ? "Loading..." : "Impersonate"}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="h-20">
                          <td colSpan="6" className="text-center italic text-gray-500">
                            No data found
                          </td>
                        </tr>
                      )}
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
                    <span>
                      Page {currentPage} of {lastPage}
                    </span>
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
                  <span className="text-lg font-semibold text-gray-600">
                    <Spinner size="lg" />{" "}
                  </span>
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