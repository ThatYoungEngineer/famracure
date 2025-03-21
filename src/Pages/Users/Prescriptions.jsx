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

        const url = window.URL.createObjectURL(new Blob([res.data]),  { type: 'application/pdf' }  );
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
                <ul className="space-y-6">
                  {prescriptions?.map((prescription, idx) => (
                    <li key={prescription.id} className="w-full flex flex-wrap justify-between border p-4 rounded-lg shadow-md">
                      <div className="w-full p-5">
                        <p className="flex items-center justify-center font-semibold h-10 w-10 rounded-full bg-gray-300">{idx + 1}</p>
                      </div>
                      <h3 className="text-lg"> <strong>Prescription ID:</strong> {prescription.id}</h3>
                      <p><strong>Doctor ID:</strong> {prescription.doctor_id}</p>
                      <p><strong>User ID:</strong> {prescription.user_id}</p>
                      <p><strong>Appointment ID:</strong> {prescription.appointment_id}</p>
                      <p><strong>Date:</strong> {prescription.prescription_date}</p>
                      <p><strong>Expiry Date:</strong> {prescription.expiry_date}</p>
                      <p><strong>Notes:</strong> {prescription.notes}</p>
                      <p><strong>Pharmacy:</strong> {prescription.pharmacy_name}, {prescription.pharmacy_address}</p>
                      <p><strong>Refill:</strong> {prescription.refill_remaining} remaining</p>
                      <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${prescription.status === 'pending' ? 'bg-yellow-200' : 'bg-green-200'}`}>{prescription.status}</span></p>
                      <div
                        className="!my-5 w-full flex items-center justify-between"
                      >
                        {prescription.file_path && (
                          <Button
                            variant="contained"
                            color="secondary"
                          >
                            <a
                              href={`https://backend.famracure.com/${prescription.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Prescription
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handlePrescriptionDownload(prescription.id) }                          
                        >
                          Download
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
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