import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../../AxiosClient";
import Chat from "../../Chat";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Button } from "@mui/material";
import MedicationsInput from "./MedicationsInput";

const TableAppointment = ({ showAnnuler, setShowAnnuler, setIdAppointment }) => {
  const doctorData = useSelector((state) => state.AuthDoctor);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrescriptionOpen, setPrescriptionOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionError, setPrescriptionError] = useState("")
  const navigate = useNavigate();

  const [prescriptionFormData, setPrescriptionFormData] = useState({
    user_id: "", doctor_id: "", 
    appointment_id: "",
    prescription_date: "",
    content: "",
    medications: [], // Initialize as empty JSON object
    notes: "",
    expiry_date: "",
    signature: "",
    pharmacy_name: "",
    pharmacy_address: "",
    refill_count: 0,
    refill_remaining: 0,
    status: "pending",
  });
  const [creating, setCreating] = useState(false);

  console.log('prescriptionFormData: ', prescriptionFormData)

  useEffect(() => {
    if (selectedAppointment) {
      setPrescriptionFormData((prevData) => ({
        ...prevData,
        user_id: selectedAppointment.user_id,
        doctor_id: selectedAppointment.doctor_id,
        appointment_id: selectedAppointment.id
      }));
    }
  }, [selectedAppointment]);

  console.log('selectedAppointment: ', selectedAppointment)
  console.log('prescriptionFormData: ', prescriptionFormData)


  const handlePrescriptionChange = (e) => {
    setPrescriptionFormData({ ...prescriptionFormData, [e.target.name]: e.target.value });
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...prescriptionFormData,
      refill_count: parseInt(prescriptionFormData.refill_count, 10),
      refill_remaining: parseInt(prescriptionFormData.refill_remaining, 10),
    };
    
    setCreating(true);
    axiosClient
    .post("/prescriptions", dataToSubmit)
    .then(res => {
      console.log('prescription api response: ', res)
      alert("Prescription Created Successfully!");
      setCreating(false);
    })
    .catch(err => {
      const errorMessage = err.response.data.message
      setPrescriptionError(errorMessage)
      console.error("Error creating prescription:", errorMessage);
      setCreating(false);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    axiosClient
      .get(`/appointments`)
      .then((res) => {
        if (res.status === 200) {
          setAppointments(res.data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }, [])

  const handleAcceptReschedule = async (e) => {
    try {
      const res = await axiosClient.post(`/appointments/${e}/approve-reschedule`, { accept_reschedule: true });
      if (res.status === 200) {
        console.log("Reschedule Accepted");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    {["Status", "Type", "Full Name", "Email", "Phone Number", "Appointment Date", "Appointment Time", "Action"].map((header) => (
                      <th key={header} className="p-4 text-[14px] font-medium text-left text-gray-500 uppercase">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(appointments && appointments.length > 0) ? appointments.map((el, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="p-4 max-w-fit text-[14px] text-gray-500">
                        <span
                          className={`w-fit text-left px-3 py-1 rounded-full text-sm font-medium ${
                            el?.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : el?.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : el?.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {el?.status}
                        </span>
                      </td>
                      <td className="p-4 text-[14px] text-gray-500">{el?.appointment_type}</td>
                      <td className={`p-4 text-[14px] font-medium text-gray-900 ${el.user ? "not-italic" : "italic text-opacity-40"} `} >{el?.user ? `${el?.user?.firstname} ${el?.user?.lastname}` : "NULL"}</td>
                      <td className={`p-4 text-[14px] text-gray-900 ${el.user ? "not-italic" : "italic text-opacity-40"}`}>{el?.user ? el?.user?.email : "NULL"}</td>
                      <td className={`p-4 text-[14px] text-gray-900 ${el.user ? "not-italic" : "italic text-opacity-40"}`}>{el?.user ? el?.user?.phone_number : "NULL"}</td>
                      <td className="p-4 text-[14px] text-gray-500">{el?.appointment_date}</td>
                      <td className="p-4 text-[14px] text-gray-500">{el?.appointment_time}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => setSelectedAppointment(el)}
                          className="flex items-center gap-2 px-2 py-[8px] text-[14px] text-white rounded-lg bg-primary-600 hover:bg-primary-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                          </svg>
                          View
                        </button>
                        <button
                          // onClick={() => setSelectedAppointment(el)}
                          className="flex items-center gap-2 px-2 py-[8px] text-[14px] text-red-100 rounded-lg bg-red-600 hover:bg-red-800"
                        >
                         <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                            Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                  :
                   !isLoading && 
                    <tr className="h-20">
                      <td colSpan="8" className="text-center italic text-gray-500">
                        No data found
                      </td>
                    </tr>
                  }                  
                </tbody>
              </table>
              {isLoading &&
                <div className=" flex justify-center items-center h-20 ">
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
                }
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Dialog */}
      {selectedAppointment && (
        <Dialog
          header=""
          visible={!!selectedAppointment}
          maximized
          style={{ width: "50vw" }}
          onHide={() => setSelectedAppointment(null)}
        >
          <div className="w-full m-0 flex flex-col gap-1">
            <div className="w-full flex items-center justify-between">
              <section className="w-full flex flex-col gap-2">
                {(selectedAppointment.status === "confirmed" || selectedAppointment.status === "completed")
                  &&
                    <section className="w-full flex flex-col gap-2 mb-5">
                      <h1 className="flex-1 text-left font-bold text-2xl">Patient Information:</h1>
                      <div>
                        <div>Name: <span className="font-bold"> {selectedAppointment?.user?.firstname} {selectedAppointment?.user?.lastname}</span></div>
                        <div>Email: {selectedAppointment?.user?.email}</div>
                        <div>Phone: {selectedAppointment?.user?.phone_number}</div>
                        <div>CNIC: {selectedAppointment?.user?.cin}</div>
                      </div>
                    </section>
                }
                <div className="w-full flex items-center justify-between">
                  <h2 className="flex-1 text-left">Appointment Type:</h2>
                  <h2 className="flex-1 text-left">Appointment Status:</h2>
                  <h2 className="flex-1 text-center">Appointment Fee</h2>
                  {(selectedAppointment?.status === "confirmed" || selectedAppointment?.status === "completed" ) && (
                    <>
                      <h2 className="flex-1 text-center">Join Call</h2>
                      <h2 className="flex-1 text-center">Create Prescription</h2>
                    </>
                  )}
                </div>
              </section>
            </div>

            <div className="flex items-center justify-between font-semibold">
              <h2 className="flex-1 text-left">{selectedAppointment?.appointment_type}</h2>
              <div className="flex-1">
                <h2
                  className={`w-fit text-left px-3 py-1 rounded-full text-sm font-medium ${
                    selectedAppointment?.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : selectedAppointment?.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : selectedAppointment?.status === "completed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedAppointment?.status}
                </h2>
              </div>
              <h2 className="flex-1 text-center">PKR/- {selectedAppointment?.appointment_type === "video" ? selectedAppointment?.video_fee : selectedAppointment?.clinic_fee}</h2>
              {selectedAppointment?.appointment_type === "video" && (selectedAppointment?.status === "confirmed" || selectedAppointment?.status === "completed" ) && (
                <span className="flex-1 flex items-center justify-center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={selectedAppointment?.status === "cancelled"}
                    onClick={() => navigate(`/room/${selectedAppointment?.id}`, { state: { user: doctorData.doctor } })}
                  >
                    Join Call
                  </Button>
                </span>
              )}
              {(selectedAppointment?.status === "confirmed" || selectedAppointment?.status === "completed" ) && (
                <span className="flex-1 flex items-center justify-center">
                  <Button 
                    variant="contained"
                    color="secondary"
                    size="small"
                    disabled={selectedAppointment?.status === "cancelled"}
                    onClick={() => {setSelectedAppointment(null); setPrescriptionOpen(true)} }
                  >
                    Create Prescription
                  </Button>
                </span>
              )}
            </div>
            {(selectedAppointment.reschedule_requested || selectedAppointment.reschedule_requested == '1')
              && <div className="w-full my-5 flex flex-col gap-1">
                <h1 className="font-semibold"> A Reschedule is requested.. </h1>
                <p>Reschedule Date: {selectedAppointment?.rescheduled_date || "N/A"} </p>
                <p>Reschedule Time: {selectedAppointment?.rescheduled_time || "N/A"} </p>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  type="button"
                  className="w-fit"
                  onClick={() => handleAcceptReschedule(selectedAppointment?.id)}
                >
                  Accept Reschedule
                </Button>
              </div>
            }
            {(selectedAppointment?.status === "confirmed" || selectedAppointment?.status === "completed") && 
              <section className="mt-20 w-full">
                <Chat doctor_id={selectedAppointment?.doctor_id} user_id={selectedAppointment?.user_id} appointmentId={selectedAppointment?.id} />
              </section>
            }
          </div>
        </Dialog>
      )}
      
      {/* Prescription Dialog */}
      <Dialog 
        header=""
        visible={!!isPrescriptionOpen}
        maximized
        style={{ width: "50vw" }}
        onHide={() => setPrescriptionOpen(false)}
        open={isPrescriptionOpen} onOpenChange={setPrescriptionOpen}
      >
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-extrabold text-center text-gray-900">Create Prescription</h2>
            <form onSubmit={handlePrescriptionSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prescription_date" className="block text-sm font-medium text-gray-700">Prescription Date</label>
                  <input
                    type="date"
                    id="prescription_date"
                    name="prescription_date"
                    value={prescriptionFormData.prescription_date}
                    onChange={handlePrescriptionChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="date"
                    id="expiry_date"
                    name="expiry_date"
                    value={prescriptionFormData.expiry_date}
                    onChange={handlePrescriptionChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Content and Notes */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Prescription Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={prescriptionFormData.content}
                  onChange={handlePrescriptionChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows="4"
                  placeholder="Enter prescription details..."
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={prescriptionFormData.notes}
                  onChange={handlePrescriptionChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows="2"
                  placeholder="Additional notes..."
                />
              </div>

              {/* Medications (JSON) */}
              <div>
                <label htmlFor="medications" className="block text-sm font-medium text-gray-700">
                  Medications
                </label>
                <MedicationsInput
                  value={prescriptionFormData.medications}
                  onChange={(value) =>
                    setPrescriptionFormData((prevData) => ({
                      ...prevData,
                      medications: value,
                    }))
                  }
                />
              </div>

              {/* Pharmacy Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pharmacy_name" className="block text-sm font-medium text-gray-700">Pharmacy Name</label>
                  <input
                    type="text"
                    id="pharmacy_name"
                    name="pharmacy_name"
                    value={prescriptionFormData.pharmacy_name}
                    onChange={handlePrescriptionChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="pharmacy_address" className="block text-sm font-medium text-gray-700">Pharmacy Address</label>
                  <input
                    type="text"
                    id="pharmacy_address"
                    name="pharmacy_address"
                    value={prescriptionFormData.pharmacy_address}
                    onChange={handlePrescriptionChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Refill Count and Refill Remaining */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="refill_count" className="block text-sm font-medium text-gray-700">Refill Count</label>
                  <input
                    type="number"
                    id="refill_count"
                    name="refill_count"
                    value={prescriptionFormData.refill_count}
                    onChange={handlePrescriptionChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="refill_remaining" className="block text-sm font-medium text-gray-700">Refill Remaining</label>
                  <input
                    type="number"
                    id="refill_remaining"
                    name="refill_remaining"
                    value={prescriptionFormData.refill_remaining}
                    onChange={handlePrescriptionChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Signature and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signature" className="block text-sm font-medium text-gray-700">Signature</label>
                  <input
                    type="text"
                    id="signature"
                    name="signature"
                    value={prescriptionFormData.signature}
                    onChange={handlePrescriptionChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={prescriptionFormData.status}
                    onChange={handlePrescriptionChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Prescription
                </button>
              </div>
              {prescriptionError && <p className="text-red-400 text-sm">{prescriptionError}</p>}
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TableAppointment;
