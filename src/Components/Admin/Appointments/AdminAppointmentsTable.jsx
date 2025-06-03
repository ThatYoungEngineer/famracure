import { Spinner, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import axiosClient from '../../../AxiosClient';

const AdminAppointmentsTable = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalAppointments, setTotalAppointments] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    useEffect(() => {
        fetchAdminAppointments(currentPage);
    }, [currentPage]);

    const fetchAdminAppointments = async (page) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/admin/appointments?page=${page}`);
            setAppointments(response.data.data || []);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
            setTotalAppointments(response.data.total);
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to filter appointments based on search query
    const filteredAppointments = appointments.filter((appointment) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            appointment.id.toString().toLowerCase().includes(searchLower) ||
            appointment.status.toLowerCase().includes(searchLower) ||
            (appointment.doctor?.firstname + " " + appointment.doctor?.lastname)
                .toLowerCase()
                .includes(searchLower) ||
            (appointment.user?.firstname + " " + appointment.user?.lastname)
                .toLowerCase()
                .includes(searchLower) ||
            (appointment.appointment_type === "video" ? appointment.video_fee : appointment.clinic_fee)
                .toString()
                .toLowerCase()
                .includes(searchLower) ||
            (appointment.payment_id ?? "NULL").toLowerCase().includes(searchLower) ||
            new Date(appointment.created_at).toLocaleString().toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
                <div className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 flex-col mb-4 sm:mb-6 text-base sm:text-lg text-green-700 bg-green-100 px-6 sm:px-10 py-4 sm:py-6 rounded-lg">
                    <h2>Total Appointments</h2>
                    {loading ? <Spinner /> : <h2>{totalAppointments}</h2>}
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-3 sm:mb-4">
                <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Mobile Card View (visible only on small screens) */}
            <div className="block sm:hidden">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((el, idx) => (
                        <div key={idx} className="bg-white p-3 mb-3 rounded-lg shadow border border-gray-200">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-3 mb-2">
                                <div className="text-xs font-medium text-gray-500">Appointment ID:</div>
                                <div className="text-xs font-semibold text-gray-900 break-words">{el?.id}</div>

                                <div className="text-xs font-medium text-gray-500">Status:</div>
                                <div className="text-xs font-semibold text-gray-900 break-words">{el?.status}</div>

                                <div className="text-xs font-medium text-gray-500">Doctor:</div>
                                <div className="text-xs font-medium text-gray-900 break-words">
                                    {el?.doctor?.firstname} {el?.doctor?.lastname}
                                </div>

                                <div className="text-xs font-medium text-gray-500">Patient:</div>
                                <div className="text-xs font-normal text-gray-700 break-words">
                                    {el?.user ? el?.user?.firstname + " " + el?.user?.lastname : "NULL"}
                                </div>

                                <div className="text-xs font-medium text-gray-500">Amount (PKR):</div>
                                <div className="text-xs font-medium text-gray-900 break-words">
                                    {el?.appointment_type === "video" ? el?.video_fee : el?.clinic_fee}
                                </div>

                                <div className="text-xs font-medium text-gray-500">Transaction ID:</div>
                                <div className="text-xs text-gray-900 break-words">{el?.payment_id ?? "NULL"}</div>

                                <div className="text-xs font-medium text-gray-500">Time Stamp:</div>
                                <div className="text-xs text-gray-900 break-words">{new Date(el?.created_at).toLocaleString()}</div>
                            </div>
                        </div>
                    ))
                ) : !loading ? (
                    <div className="text-center italic text-gray-500 py-8">
                        No data found
                    </div>
                ) : null}

                {loading && (
                    <div className="flex justify-center items-center h-40">
                        <Spinner />
                    </div>
                )}
            </div>

            {/* Desktop Table View (hidden on small screens) */}
            <div className="hidden sm:block overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    {["Appointment Id", "Status", "Doctor", "Patient", "Amount (PKR)", "Transaction Id", "Time Stamp"].map((heading, idx) => (
                                        <th key={idx} className="p-3 sm:p-4 text-xs sm:text-[14px] font-medium text-left text-gray-500 uppercase">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((el, idx) => (
                                        <tr key={idx} className="hover:bg-gray-100">
                                            <td className="p-3 sm:p-4 text-xs sm:text-[14px] font-semibold text-gray-900">{el?.id}</td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-[14px] font-semibold text-gray-900">{el?.status}</td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-[14px] font-medium text-gray-900">
                                                {el?.doctor?.firstname} {el?.doctor?.lastname}
                                            </td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-[14px] font-normal text-gray-500">
                                                {el?.user ? el?.user?.firstname + " " + el?.user?.lastname : "NULL"}
                                            </td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-[14px] font-medium text-gray-900">
                                                {el?.appointment_type === "video" ? el?.video_fee : el?.clinic_fee}
                                            </td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-[14px] text-gray-900">{el?.payment_id ?? "NULL"}</td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-[14px] text-gray-900">{new Date(el?.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : !loading ? (
                                    <tr className="h-20">
                                        <td colSpan="7" className="text-center italic text-gray-500">
                                            No data found
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>

                        {loading && (
                            <div className="flex justify-center items-center h-60 sm:h-96">
                                <Spinner />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-4 sm:mt-6 text-sm">
                <Button size="sm" className="px-2 py-1 sm:px-4 sm:py-2" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                    Previous
                </Button>
                <span className="text-xs sm:text-sm">Page {currentPage} of {lastPage}</span>
                <Button size="sm" className="px-2 py-1 sm:px-4 sm:py-2" disabled={currentPage === lastPage} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default AdminAppointmentsTable;
