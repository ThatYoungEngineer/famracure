import { CheckCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../AxiosClient";
import { Spinner } from "flowbite-react";

const PaymentsTable = () => {
  const [payments, setPayments] = useState([]);
  const [totalPayments, setTotalPayments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/admin/payments");
      setPayments(response.data.payments);
      setTotalPayments(response.data.total_payments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((el) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      el?.id?.toString().includes(searchLower) ||
      el?.doctor?.id?.toString().includes(searchLower) ||
      el?.user?.id?.toString().includes(searchLower) ||
      (el?.user?.firstname + " " + el?.user?.lastname)
        .toLowerCase()
        .includes(searchLower) ||
      (el?.doctor?.firstname + " " + el?.doctor?.lastname)
        .toLowerCase()
        .includes(searchLower) ||
      el?.payment_status?.toLowerCase().includes(searchLower) ||
      el?.payment_id?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
          <div className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 flex-col mb-4 sm:mb-6 text-base sm:text-lg text-green-700 bg-green-100 px-6 sm:px-10 py-4 sm:py-6 rounded-lg">
            <h2>Total Payments</h2>
            {loading ? <Spinner /> : <h2>{payments.length > 0 ? payments.length : "0"}</h2>}
          </div>
          <div className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 flex-col mb-4 sm:mb-6 text-base sm:text-lg text-orange-700 bg-orange-100 px-6 sm:px-10 py-4 sm:py-6 rounded-lg">
            <h2>Total Payments Amount</h2>
            {loading ? <Spinner /> : <h2>{totalPayments ? `PKR/- ${totalPayments}` : "0"}</h2>}
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mobile Card View (visible on small screens) */}
        <div className="block sm:hidden">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((el, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200 overflow-hidden">
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex flex-row items-center">
                    <div className="text-xs font-medium text-gray-500 w-1/3">Appointment Id:</div>
                    <div className="text-xs break-words w-2/3">{el?.id}</div>
                  </div>

                  <div className="flex flex-row items-center">
                    <div className="text-xs font-medium text-gray-500 w-1/3">Doctor Id:</div>
                    <div className="text-xs break-words w-2/3">{el?.doctor?.id}</div>
                  </div>

                  <div className="flex flex-row items-center">
                    <div className="text-xs font-medium text-gray-500 w-1/3">Patient Id:</div>
                    <div className="text-xs break-words w-2/3">{el?.user?.id}</div>
                  </div>

                  <div className="flex flex-row items-center">
                    <div className="text-xs font-medium text-gray-500 w-1/3">Patient Name:</div>
                    <div className="text-xs break-words w-2/3">{el?.user?.firstname + " " + el?.user?.lastname}</div>
                  </div>

                  <div className="flex flex-row items-center">
                    <div className="text-xs font-medium text-gray-500 w-1/3">Doctor Name:</div>
                    <div className="text-xs break-words w-2/3">{el?.doctor?.firstname + " " + el?.doctor?.lastname}</div>
                  </div>

                  <div className="flex flex-row items-center">
                    <div className="text-xs font-medium text-gray-500 w-1/3">Amount (PKR):</div>
                    <div className="text-xs break-words w-2/3">{el?.appointment_type === "video" ? el?.video_fee : el?.clinic_fee}</div>
                  </div>

                  <div className="flex flex-row items-center">
                    <div className="text-xs font-medium text-gray-500 w-1/3">Status:</div>
                    <div className="text-xs break-words w-2/3">{el?.payment_status}</div>
                  </div>

                  <div className="flex flex-row items-center">
                    <div className="text-xs font-medium text-gray-500 w-1/3">Transaction Id:</div>
                    <div className="text-xs break-all w-2/3">{el?.payment_id}</div>
                  </div>

                  <div className="flex flex-row items-center">
                    <div className="text-xs font-medium text-gray-500 w-1/3">Time Stamp:</div>
                    <div className="text-xs break-words w-2/3">{new Date(el?.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))
          ) : !loading && (
            <div className="text-center italic text-gray-500 py-8">
              No data found
            </div>
          )}
          {loading && (
            <div className="flex justify-center items-center h-20">
              <Spinner />
            </div>
          )}
        </div>

        {/* Table View (hidden on small screens, visible on medium and up) */}
        <div className="hidden sm:block overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 sm:p-4 text-[12px] sm:text-[14px] font-medium text-left text-gray-500 uppercase">Appointment Id</th>
                    <th className="p-3 sm:p-4 text-[12px] sm:text-[14px] font-medium text-left text-gray-500 uppercase">Doctor Id</th>
                    <th className="p-3 sm:p-4 text-[12px] sm:text-[14px] font-medium text-left text-gray-500 uppercase">Patient Id</th>
                    <th className="p-3 sm:p-4 text-[12px] sm:text-[14px] font-medium text-left text-gray-500 uppercase">Patient Name</th>
                    <th className="p-3 sm:p-4 text-[12px] sm:text-[14px] font-medium text-left text-gray-500 uppercase">Doctor Name</th>
                    <th className="p-3 sm:p-4 text-[12px] sm:text-[14px] font-medium text-left text-gray-500 uppercase">Amount (PKR)</th>
                    <th className="p-3 sm:p-4 text-[12px] sm:text-[14px] font-medium text-left text-gray-500 uppercase">Status</th>
                    <th className="p-3 sm:p-4 text-[12px] sm:text-[14px] font-medium text-left text-gray-500 uppercase">Transaction Id</th>
                    <th className="p-3 sm:p-4 text-[12px] sm:text-[14px] font-medium text-left text-gray-500 uppercase">Time Stamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((el, idx) => (
                      <tr key={idx} className="hover:bg-gray-100 text-xs sm:text-sm">
                        <td className="p-3 sm:p-4 whitespace-nowrap">{el?.id}</td>
                        <td className="p-3 sm:p-4">{el?.doctor?.id}</td>
                        <td className="p-3 sm:p-4">{el?.user?.id}</td>
                        <td className="p-3 sm:p-4">{el?.user?.firstname + " " + el?.user?.lastname}</td>
                        <td className="p-3 sm:p-4">{el?.doctor?.firstname + " " + el?.doctor?.lastname}</td>
                        <td className="p-3 sm:p-4">{el?.appointment_type === "video" ? el?.video_fee : el?.clinic_fee}</td>
                        <td className="p-3 sm:p-4">{el?.payment_status}</td>
                        <td className="p-3 sm:p-4">{el?.payment_id}</td>
                        <td className="p-3 sm:p-4">{new Date(el?.created_at).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : !loading && (
                    <tr className="h-20">
                      <td colSpan="9" className="text-center italic text-gray-500">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {loading && (
                <div className="flex justify-center items-center h-20">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentsTable;
