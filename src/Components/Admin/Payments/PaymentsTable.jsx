import { CheckCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import axiosClient from "../../../AxiosClient";
import { Spinner } from "flowbite-react";

const PaymentsTable = () => {
  const [payments, setPayments] = useState([]);
  const [totalPayments, setTotalPayments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

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

  // Function to filter payments based on search query
  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      payment.id.toString().toLowerCase().includes(searchLower) ||
      payment.doctor?.id.toString().toLowerCase().includes(searchLower) ||
      payment.user?.id.toString().toLowerCase().includes(searchLower) ||
      (payment.user?.firstname + " " + payment.user?.lastname)
        .toLowerCase()
        .includes(searchLower) ||
      (payment.doctor?.firstname + " " + payment.doctor?.lastname)
        .toLowerCase()
        .includes(searchLower) ||
      payment.payment_status.toLowerCase().includes(searchLower) ||
      payment.payment_id.toLowerCase().includes(searchLower) ||
      payment.appointment_type === 'video' ? payment.video_fee.toString().includes(searchLower) : payment.clinic_fee.toString().includes(searchLower)  ||
      new Date(payment.created_at).toLocaleString().toLowerCase().includes(searchLower)
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

        {/* Search Bar */}
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
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">
                      Appointment Id
                    </th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">
                      Doctor Id
                    </th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">
                      Patient Id
                    </th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">
                      Patient Name
                    </th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">
                      Doctor Name
                    </th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">
                      Amount (PKR)
                    </th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">
                      Transaction Id
                    </th>
                    <th className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">
                      Time Stamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((el, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        <td className="flex items-center p-4 whitespace-nowrap">
                          <div className="text-[14px] font-normal text-gray-500">
                            <div className="text-[14px] font-semibold text-gray-900">
                              {el?.id}
                            </div>
                          </div>
                        </td>
                        <td className="max-w-sm p-4 overflow-hidden text-[14px] font-normal text-gray-500 truncate xl:max-w-xs">
                          {el?.doctor?.id}
                        </td>
                        <td className="max-w-sm p-4 overflow-hidden text-[14px] font-normal text-gray-500 truncate xl:max-w-xs">
                          {el?.user?.id}
                        </td>
                        <td className="max-w-sm p-4 overflow-hidden text-[14px] font-normal text-gray-500 truncate xl:max-w-xs">
                          {el?.user?.firstname + " " + el?.user?.lastname}
                        </td>
                        <td className="max-w-sm p-4 overflow-hidden text-[14px] font-normal text-gray-500 truncate xl:max-w-xs">
                          {el?.doctor?.firstname + " " + el?.doctor?.lastname}
                        </td>
                        <td className="p-4 text-[14px] font-medium text-gray-900 whitespace-nowrap">
                          {el?.appointment_type === "video" ? el?.video_fee : el?.clinic_fee}
                        </td>
                        <td className="p-4 text-[14px] font-normal text-gray-900 whitespace-nowrap">
                          {el?.payment_status}
                        </td>
                        <td className="p-4 text-[14px] font-normal text-gray-900 whitespace-nowrap">
                          {el?.payment_id}
                        </td>
                        <td className="p-4 text-[14px] font-normal text-gray-900 whitespace-nowrap">
                          {new Date(el?.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : !loading &&
                    <tr className="h-20">
                      <td colSpan="9" className="text-center italic text-gray-500">
                        No data found
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              {loading && (
                <div className="flex justify-center items-center h-20">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
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