import React, { useState, useEffect } from "react";
import { Footer, Header, UserNavSettings } from "../../Components";
import { Button, Typography } from "@mui/material";
import axiosClient from "../../AxiosClient";

// User Prescription Component
const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionError, setPrescriptionError] = useState("");
  const [loading, setLoading] = useState(true);

  console.log('prescriptions: ', prescriptions)

  useEffect(() => {
    axiosClient
      .get("/prescriptions")
      .then((res) => {
        setPrescriptions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching prescriptions:", err);
        setLoading(false);
      });
  }, []);

  const handlePrescriptionDownload = id => {
    axiosClient
      .get(`/prescriptions/${id}/download`, { responseType: "blob" })
      .then((res) => {

        const url = window.URL.createObjectURL(new Blob([res.data]), { type: 'application/pdf' });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `prescription_${id}.pdf`); // Set file name
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Cleanup

      })
      .catch((err) => {
        setPrescriptionError("File not found.");
        console.error("Error downloading:", err);
      });

  }


  return (
    <div className="w-screen h-screen">

      <Header />
      <div className="_container my-8 flex ">
        <UserNavSettings />
        <div className="w-[75%] pl-7">

          <Typography
            variant="h4"
            gutterBottom
          >
            My Prescriptions
          </Typography>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Card Header */}
            {/* Card Content */}
            <div className="p-6">
              {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : prescriptions?.length === 0 ? (
                <p className="text-center text-gray-600">No prescriptions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {prescriptions?.map((prescription, idx) => (
                        <tr key={prescription.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 font-semibold h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                {idx + 1}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {prescription.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {prescription.doctor_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {prescription.prescription_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${prescription.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                              {prescription.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {prescription.file_path && (
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  size="small"
                                >
                                  <a
                                    href={`https://backend.famracure.com/${prescription.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white no-underline"
                                  >
                                    View
                                  </a>
                                </Button>
                              )}
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handlePrescriptionDownload(prescription.id)}
                              >
                                Download
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Prescriptions;