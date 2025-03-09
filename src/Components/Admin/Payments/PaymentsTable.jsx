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
        <div className="flex items-center gap-10">
          <div className="flex-1 flex items-center justify-center gap-3 flex-col mb-6 text-lg text-green-700 bg-green-100 w-fit px-10 py-6 rounded-lg">
            <h2>Total Payments</h2>
            {loading ? <Spinner /> : <h2>{payments.length > 0 ? payments.length : "0"}</h2>}
          </div>
          <div className="flex-1 flex items-center justify-center gap-3 flex-col mb-6 text-lg text-orange-700 bg-orange-100 w-fit px-10 py-6 rounded-lg">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Appointment Id</th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Doctor Id</th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Patient Id</th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Patient Name</th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Doctor Name</th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Amount (PKR)</th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Status</th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Transaction Id</th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">Time Stamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((el, idx) => (
                      <tr key={idx} className="hover:bg-gray-100 text-sm">
                        <td className="p-4 whitespace-nowrap">{el?.id}</td>
                        <td className="p-4">{el?.doctor?.id}</td>
                        <td className="p-4">{el?.user?.id}</td>
                        <td className="p-4">{el?.user?.firstname + " " + el?.user?.lastname}</td>
                        <td className="p-4">{el?.doctor?.firstname + " " + el?.doctor?.lastname}</td>
                        <td className="p-4">{el?.appointment_type === "video" ? el?.video_fee : el?.clinic_fee}</td>
                        <td className="p-4">{el?.payment_status}</td>
                        <td className="p-4">{el?.payment_id}</td>
                        <td className="p-4">{new Date(el?.created_at).toLocaleString()}</td>
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
