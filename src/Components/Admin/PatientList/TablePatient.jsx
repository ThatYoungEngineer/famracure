import { useNavigate } from "react-router";
import axiosClient from "../../../AxiosClient";
import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import AlertSucces from "../../Alert/AlertSucces";

const TablePatient = () => {

  const navigate = useNavigate()

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [deleteSuccess, setDeleteSuccess] = useState(null)


  useEffect(() => {
    fetchPatients(currentPage);
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

  // Function to filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (patient.firstname + " " + patient.lastname).toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      patient.cin.toLowerCase().includes(searchLower) ||
      patient.phone_number.toLowerCase().includes(searchLower) ||
      (patient.active === 0 ? "no" : "yes").includes(searchLower) ||
      new Date(patient.created_at).toLocaleString().toLowerCase().includes(searchLower)
    );
  })

  const deletePatient = id => {
    setDeleteSuccess(null)

    console.log('delete id: ', id)

    axiosClient
    .delete(`user/delete`, {
      data: { id: id }, // ✅ Pass 'id' inside 'data'
    })
    .then(e => {
      setDeleteSuccess(e?.data?.deleted)
      fetchPatients(currentPage);
    })
    .catch(e => console.log('error delete doc: ', e))

  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-10">
          <div className="flex items-center justify-center gap-3 flex-col mb-6 text-base sm:text-lg text-green-700 bg-green-100 w-full sm:w-fit px-6 sm:px-10 py-4 sm:py-6 rounded-lg shadow-sm">
            <h2 className="font-medium">Total Patients</h2>
            {loading ? <Spinner /> : <h2 className="text-xl sm:text-2xl font-bold">{totalPatients}</h2>}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
        </div>

        {/* Responsive table/card layout */}
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center py-4 h-96 items-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Desktop view - Table */}
              <div className="hidden md:block overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Name</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Email</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Cin</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Phone Number</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Active</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Created At</th>
                          <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map((el, idx) => (
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
                              <td className="flex gap-2 items-center pt-2">
                                <button
                                  type="button"
                                  className="flex items-center justify-center gap-2 p-2 text-[14px] font-medium text-yellow-100 rounded-lg bg-yellow-600 hover:bg-yellow-800"
                                  onClick={() => navigate(`/admin/user-dashboard/${el.id}`)}
                                >
                                  <svg
                                    aria-hidden="true"
                                    className="w-[1.3rem] h-[1.3rem] text-yellow-100 transition duration-75 group-hover:text-yellow-900"
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
                                  onClick={() => deletePatient(el.id)}
                                  className="flex items-center gap-2 px-2 py-[8px] text-[14px] text-white rounded-lg bg-red-600 hover:bg-red-800"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                  </svg>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="h-20">
                            <td colSpan="7" className="text-center italic text-gray-500">
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mobile view - Cards */}
              <div className="md:hidden space-y-4">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((el, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900">{el?.firstname + " " + el.lastname}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${el?.active === 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                            {el?.active === 0 ? "Inactive" : "Active"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Email:</span> {el?.email}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">CIN:</span> {el?.cin}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Phone:</span> {el?.phone_number}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Created:</span> {new Date(el?.created_at).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-2 p-3 text-[14px] font-medium text-yellow-100 rounded-lg bg-yellow-600 hover:bg-yellow-800"
                            onClick={() => navigate(`/admin/user-dashboard/${el.id}`)}
                          >
                            <svg
                              aria-hidden="true"
                              className="w-[1.3rem] h-[1.3rem] text-yellow-100 transition duration-75 group-hover:text-yellow-900"
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
                            onClick={() => deletePatient(el.id)}
                            className="flex-1 flex items-center justify-center gap-2 p-3 text-[14px] text-white rounded-lg bg-red-600 hover:bg-red-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center italic text-gray-500 py-8">
                    No data found
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {deleteSuccess && <AlertSucces Message={deleteSuccess} />}

      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-6 px-2">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="py-2 px-3 sm:px-4 text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        <span className="text-sm sm:text-base font-medium">
          Page {currentPage} of {lastPage}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
          disabled={currentPage === lastPage}
          className="py-2 px-3 sm:px-4 text-sm sm:text-base"
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default TablePatient;
