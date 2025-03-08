import React, { useState, useEffect } from "react";
import axios from "axios";
import { Footer, Header, UserNavSettings } from "../../Components";
import { Typography } from "@mui/material";

// User Prescription Component
const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
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
          ) : prescriptions.length === 0 ? (
            <p className="text-center text-gray-600">No prescriptions found.</p>
          ) : (
            <ul className="space-y-6">
              {prescriptions.map((prescription) => (
                <li
                  key={prescription.id}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    {/* Prescription Content */}
                    <p className="text-gray-700 text-lg">
                      {prescription.content}
                    </p>

                    {/* Medications */}
                    <div>
                      <h3 className="font-semibold text-gray-800">Medications:</h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {prescription.medications.map((medication, index) => (
                          <li key={index}>
                            {medication.name}: {medication.dosage}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prescription Date and Expiry Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Prescription Date:
                        </h3>
                        <p className="text-gray-600">
                          {new Date(prescription.prescription_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Expiry Date:
                        </h3>
                        <p className="text-gray-600">
                          {new Date(prescription.expiry_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Refill Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Refill Count:
                        </h3>
                        <p className="text-gray-600">
                          {prescription.refill_count}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Refill Remaining:
                        </h3>
                        <p className="text-gray-600">
                          {prescription.refill_remaining}
                        </p>
                      </div>
                    </div>

                    {/* Pharmacy Information */}
                    <div>
                      <h3 className="font-semibold text-gray-800">Pharmacy:</h3>
                      <p className="text-gray-600">
                        {prescription.pharmacy_name} - {prescription.pharmacy_address}
                      </p>
                    </div>

                    {/* Download PDF Link */}
                    <div className="mt-4">
                      <a
                        href={prescription.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <span>Download PDF</span>
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </a>
                    </div>
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