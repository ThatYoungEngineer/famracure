import React, { useState, useEffect } from "react";
import { Footer, Header, UserNavSettings } from "../../Components";
import { Button, Typography, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import axiosClient from "../../AxiosClient";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionError, setPrescriptionError] = useState("");
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
    setPrescriptionError("");
    axiosClient
      .get(`/prescriptions/${id}/download`, { responseType: "blob" })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `prescription_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        setPrescriptionError("File not found.");
        console.error("Error downloading:", err);
      });
  }

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <Header />
      <div className="_container my-4 md:my-8 flex flex-col md:flex-row">
        <UserNavSettings />
        <div className={`${isMobile ? 'w-full px-2' : 'w-[75%] pl-7'} mt-4 md:mt-0`}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            className={isMobile ? "text-center" : ""}
          >
            My Prescriptions
          </Typography>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <CircularProgress />
              </div>
            ) : prescriptions?.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-center text-gray-600">No prescriptions found.</p>
              </div>
            ) : isMobile ? (
              // Mobile view - Card layout
              <div className="p-4 space-y-4">
                {prescriptions?.map((prescription, idx) => (
                  <div key={prescription.id} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="font-semibold h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">ID: {prescription.id}</p>
                          <p className="text-xs text-gray-500">Dr. ID: {prescription.doctor_id}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${prescription.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                        {prescription.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Date: {prescription.prescription_date}</p>
                    <div className="flex space-x-2">
                      {prescription.file_path && (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          fullWidth={isMobile}
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
                        fullWidth={isMobile}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Tablet and Desktop view - Table layout
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription ID</th>
                        {!isTablet && (
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor ID</th>
                        )}
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
                              <div className="flex-shrink-0 font-semibold h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {idx + 1}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {prescription.id}
                          </td>
                          {!isTablet && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {prescription.doctor_id}
                            </td>
                          )}
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
              </div>
            )}
            {prescriptionError && (
              <div className="p-4 text-center text-red-500 text-sm">
                {prescriptionError}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Prescriptions;