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
            <div className="flex items-center gap-10">
                <div className="flex-1 flex items-center justify-center gap-3 flex-col mb-6 text-lg text-green-700 bg-green-100 w-fit px-10 py-6 rounded-lg">
                    <h2>Total Appointments</h2>
                    {loading ? <Spinner /> : <h2>{totalAppointments}</h2>}
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    {["Appointment Id", "Status", "Doctor", "Patient", "Amount (PKR)", "Transaction Id", "Time Stamp"].map((heading, idx) => (
                                        <th key={idx} className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((el, idx) => (
                                        <tr key={idx} className="hover:bg-gray-100">
                                            <td className="p-4 text-[14px] font-semibold text-gray-900">{el?.id}</td>
                                            <td className="p-4 text-[14px] font-semibold text-gray-900">{el?.status}</td>
                                            <td className="p-4 text-[14px] font-medium text-gray-900">
                                                {el?.doctor?.firstname} {el?.doctor?.lastname}
                                            </td>
                                            <td className="p-4 text-[14px] font-normal text-gray-500">
                                                {el?.user ? el?.user?.firstname + " " + el?.user?.lastname : "NULL"}
                                            </td>
                                            <td className="p-4 text-[14px] font-medium text-gray-900">
                                                {el?.appointment_type === "video" ? el?.video_fee : el?.clinic_fee}
                                            </td>
                                            <td className="p-4 text-[14px] text-gray-900">{el?.payment_id ?? "NULL"}</td>
                                            <td className="p-4 text-[14px] text-gray-900">{new Date(el?.created_at).toLocaleString()}</td>
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
                            <div className="flex justify-center items-center h-96">
                                <Spinner />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                    Previous
                </Button>
                <span>Page {currentPage} of {lastPage}</span>
                <Button disabled={currentPage === lastPage} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default AdminAppointmentsTable;