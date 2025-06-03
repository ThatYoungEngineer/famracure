import React, { useEffect, useState, useReducer } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../../AxiosClient";
import Chat from "../../Chat";
import { useNavigate } from "react-router";
import { Dialog } from "primereact/dialog";
import { Button } from "@mui/material";
import MedicationsInput from "./MedicationsInput";
import AlertSucces from "../../Alert/AlertSucces";

const TableAppointment = ({ refreshApp, showAnnuler, setShowAnnuler, setIdAppointment }) => {
  const doctorData = useSelector((state) => state.AuthDoctor);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrescriptionOpen, setPrescriptionOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionError, setPrescriptionError] = useState("")
  const [completeAppointment, setCompleteAppointment] = useState("")
  const navigate = useNavigate();

  const [rescheduleSuccess, setRescheduleSuccess] = useState(null)


  const [openUpdateAppointment, setOpenUpdateAppointment] = useState(null)

  const [refresh, setRefresh] = useState(false)

  const [invoiceError, setInvoiceError] = useState(null)

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
  }, [refresh, refreshApp])

  const handleAcceptReschedule = async (e) => {
    setRescheduleSuccess(null)
    try {
      const res = await axiosClient.post(`/appointments/${e}/approve-reschedule`, {
        new_date: selectedAppointment?.rescheduled_date,
        new_time: selectedAppointment?.rescheduled_time ? selectedAppointment?.rescheduled_time : "05:00",
      });
      if (res.status == 200) {
        setRescheduleSuccess(res?.data?.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const generateInvoice = (id) => {
    setInvoiceError(null)
    axiosClient
      .post(`/appointments/${id}/generate-invoice`)
      .then((res) => {
        console.log('response', res)

      })
      .catch((err) =>
        setInvoiceError(err?.response?.data?.error)
      )

  }

  const downloadInvoice = (id) => {
    setInvoiceError(null)
    axiosClient
      .get(`/appointments/${id}/invoice`, { responseType: "blob" })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${id}.pdf`); // Set file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.log('err download: ', err)
        err?.response?.data && setInvoiceError("Invoice not found")
      })
  }
  const downloadPrescription = (id) => {
    axiosClient
      .get(`/prescriptions/${id}/download`, { responseType: "blob" })
      .then((res) => {
        console.log('res of download prescription: ', res)
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${id}.pdf`); // Set file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  const deleteApp = (id) => {
    axiosClient
      .delete(`/appointments/${id}`)
      .then((res) => {
        console.log('response', res)
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setRefresh(prev => !prev)
      })
  }


  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_DATE":
        return { ...state, dateAppointment: action.payload };
      case "SET_TIME_SLOT":
        return { ...state, timeSlot: { ...state.timeSlot, [action.field]: action.payload } };
      case "ADD_SELECTED_TIME":
        return { ...state, selectedTimes: [...state.selectedTimes, action.payload] };
      case "REMOVE_SELECTED_TIME":
        return { ...state, selectedTimes: state.selectedTimes.filter((_, index) => index !== action.payload) };
      case "SET_LOADING":
        return { ...state, isLoading: action.payload };
      case "SET_SUCCESS_MESSAGE":
        return { ...state, successMessage: action.payload };
      case "RESET":
        return getInitialState(); // Reset properly
      default:
        return state;
    }
  };

  // 🛠️ Function to generate initial state dynamically
  const getInitialState = () => ({
    dateAppointment: openUpdateAppointment?.appointment_date || "",
    timeSlot: {
      appointment_time: openUpdateAppointment?.appointment_time || "",
      video_fee: openUpdateAppointment?.video_fee || "",
      clinic_fee: openUpdateAppointment?.clinic_fee || "",
      appointment_type: openUpdateAppointment?.appointment_type || "",
    },
    selectedTimes: [],
    isLoading: false,
    successMessage: ""
  });

  // ✅ Use `useReducer` properly
  const [state, dispatch] = useReducer(reducer, getInitialState());

  // ✅ Update state when `openUpdateAppointment` changes
  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [openUpdateAppointment]);


  const postAppointment = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_SUCCESS_MESSAGE", payload: "" });
    try {
      // Prepare time slots with shared details
      const timeSlots = state.selectedTimes.map((time) => ({
        appointment_time: time,
        video_fee: state.timeSlot.video_fee,
        clinic_fee: state.timeSlot.clinic_fee,
        appointment_type: state.timeSlot.appointment_type
      }));

      const response = await axiosClient.put(`/appointments/${openUpdateAppointment.id}`, {
        appointment_date: state.dateAppointment,
        appointment_time: state.timeSlot.appointment_time ? state.timeSlot.appointment_time : state.selectedTimes[0], // Send only the first selected time
        video_fee: state.timeSlot.video_fee,
        clinic_fee: state.timeSlot.clinic_fee,
        appointment_type: state.timeSlot.appointment_type,
      });

      if (response?.data?.message) {
        dispatch({ type: "SET_SUCCESS_MESSAGE", payload: response.data.message });
        refreshApp(prev => !prev)
      }
    } catch (error) {
      console.error("Error posting appointment:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.dateAppointment || (!state.timeSlot.appointment_time)) {
      alert("Please enter a date and at least one time.");
      return;
    }
    postAppointment();
  };

  const handleTimeChange = (e) => {
    let [hours, minutes] = e.target.value.split(":").map(Number);
    minutes = Math.round(minutes / 15) * 15;
    if (minutes === 60) {
      minutes = 0;
      hours += 1;
    }
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    dispatch({ type: "SET_TIME_SLOT", field: "appointment_time", payload: formattedTime });
  };

  const handleCompleteAppointment = (id) => {
    console.log("handleCompleteAppointment: ", id)
    axiosClient
      .patch(`/appointments/${id}/complete`)
      .then((res) => {
        console.log("Appointment complete res: ", res)
        setCompleteAppointment(res.data.message)
        refreshApp(prev => !prev)
      })
      .catch((error) => {
        alert(error?.response?.data?.message)
      });
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:flex md:flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow rounded-lg">
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
                          className={`w-fit text-left px-3 py-1 rounded-full text-sm font-medium ${el?.status === "confirmed"
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
                          type="button"
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
                          type="button"
                          onClick={() => setOpenUpdateAppointment(el)}
                          className="flex items-center gap-2 px-2 py-[8px] text-[14px] text-white rounded-lg bg-yellow-600 hover:bg-yellow-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                          </svg>
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteApp(el.id)}
                          className="flex items-center gap-2 px-2 py-[8px] text-[14px] text-white rounded-lg bg-red-600 hover:bg-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                          </svg>
                          Delete
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
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 gap-4 px-4">
          {(appointments && appointments.length > 0) ? appointments.map((el, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`text-left px-3 py-1 rounded-full text-xs font-medium ${el?.status === "confirmed"
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
                <span className="text-xs text-gray-500">{el?.appointment_type}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Patient:</p>
                  <p className={`text-sm font-medium ${el.user ? "not-italic" : "italic text-opacity-40"}`}>
                    {el?.user ? `${el?.user?.firstname} ${el?.user?.lastname}` : "NULL"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email:</p>
                  <p className={`text-sm truncate ${el.user ? "not-italic" : "italic text-opacity-40"}`}>
                    {el?.user ? el?.user?.email : "NULL"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Phone:</p>
                  <p className={`text-sm ${el.user ? "not-italic" : "italic text-opacity-40"}`}>
                    {el?.user ? el?.user?.phone_number : "NULL"}
                  </p>
                </div>

                <div className="flex space-x-4">
                  <div>
                    <p className="text-xs text-gray-500">Date:</p>
                    <p className="text-sm">{el?.appointment_date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time:</p>
                    <p className="text-sm">{el?.appointment_time}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(el)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded-lg bg-primary-600 hover:bg-primary-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                  </svg>
                  View
                </button>

                <button
                  type="button"
                  onClick={() => setOpenUpdateAppointment(el)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded-lg bg-yellow-600 hover:bg-yellow-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                  </svg>
                  Update
                </button>

                <button
                  type="button"
                  onClick={() => deleteApp(el.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded-lg bg-red-600 hover:bg-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
            :
            !isLoading &&
            <div className="text-center italic text-gray-500 py-8">
              No data found
            </div>
          }
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading &&
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
      }

      {/* Appointment Dialog */}
      {selectedAppointment && (
        <Dialog
          header=""
          visible={!!selectedAppointment}
          maximized
          className="w-full md:w-4/5 lg:w-3/4 xl:w-1/2"
          onHide={() => setSelectedAppointment(null)}
        >
          <div className="w-full m-0 flex flex-col gap-2 p-2 md:p-4">
            {/* Action Buttons */}
            <div className="w-full flex flex-wrap gap-2 justify-center">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={(e) => generateInvoice(selectedAppointment.id)}
                className="w-full sm:w-auto p-2 text-xs md:text-sm"
              >
                Generate Invoice
              </Button>

              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={(e) => downloadInvoice(selectedAppointment.id)}
                className="w-full sm:w-auto p-2 text-xs md:text-sm"
              >
                Download Invoice
              </Button>

              <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={(e) => downloadPrescription(selectedAppointment.id)}
                className="w-full sm:w-auto p-2 text-xs md:text-sm"
              >
                Download Prescription
              </Button>
            </div>

            {invoiceError && <p className="w-full text-center text-red-500 text-sm">{invoiceError}</p>}

            <div className="w-full">
              <section className="w-full flex flex-col gap-2">
                {(selectedAppointment.status === "confirmed" || selectedAppointment.status === "completed")
                  &&
                  <section className="w-full flex flex-col gap-2 mb-5 p-2 bg-gray-50 rounded-lg">
                    <h1 className="text-left font-bold text-lg md:text-xl lg:text-2xl border-b pb-2">Patient Information:</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm md:text-base">
                      <div>Name: <span className="font-bold"> {selectedAppointment?.user?.firstname} {selectedAppointment?.user?.lastname}</span></div>
                      <div className="truncate">Email: <span className="font-medium">{selectedAppointment?.user?.email}</span></div>
                      <div>Phone: <span className="font-medium">{selectedAppointment?.user?.phone_number}</span></div>
                      <div>CNIC: <span className="font-medium">{selectedAppointment?.user?.cin}</span></div>
                      <div>Age: <span className="font-medium">{selectedAppointment?.user?.age} years</span></div>
                      <div className="capitalize">Gender: <span className="font-medium">{selectedAppointment?.user?.gender}</span></div>
                    </div>
                  </section>
                }
                {completeAppointment &&
                  <div className="w-full flex items-center justify-center text-green-400 my-2 p-2 bg-green-50 rounded">
                    {completeAppointment}
                  </div>
                }

                {/* Appointment Details Headers - Desktop */}
                <div className="hidden md:flex w-full items-center justify-between border-b pb-2">
                  <h2 className="flex-1 text-left font-medium">Appointment Type:</h2>
                  <h2 className="flex-1 text-left font-medium">Appointment Status:</h2>
                  <h2 className="flex-1 text-center font-medium">Appointment Fee</h2>
                  {(selectedAppointment?.status === "confirmed" || selectedAppointment?.status === "completed") && (
                    <>
                      <h2 className="flex-1 text-center font-medium">Join Call</h2>
                      <h2 className="flex-1 text-center font-medium">Create Prescription</h2>
                      <h2 className="flex-1 text-center font-medium">Complete Appointment</h2>
                    </>
                  )}
                </div>

                {/* Appointment Details Headers - Mobile */}
                <div className="md:hidden w-full grid grid-cols-1 gap-2 mt-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">Type:</span>
                    <span>{selectedAppointment?.appointment_type}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${selectedAppointment?.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : selectedAppointment?.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : selectedAppointment?.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {selectedAppointment?.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">Fee:</span>
                    <span>PKR/- {selectedAppointment?.appointment_type === "video" ? selectedAppointment?.video_fee : selectedAppointment?.clinic_fee}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Desktop view for appointment actions */}
            <div className="hidden md:flex items-center justify-between font-semibold">
              <h2 className="flex-1 text-left">{selectedAppointment?.appointment_type}</h2>
              <div className="flex-1">
                <h2
                  className={`w-fit text-left px-3 py-1 rounded-full text-sm font-medium ${selectedAppointment?.status === "confirmed"
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
              {selectedAppointment?.appointment_type === "video" && (selectedAppointment?.status === "confirmed" || selectedAppointment?.status === "completed") && (
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
              {(selectedAppointment?.status === "confirmed" || selectedAppointment?.status === "completed") && (
                <>
                  <span className="flex-1 flex items-center justify-center">
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      disabled={selectedAppointment?.status === "cancelled"}
                      onClick={() => { setSelectedAppointment(null); setPrescriptionOpen(true) }}
                    >
                      Create Prescription
                    </Button>
                  </span>
                  <span className="flex-1 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="contained"
                      color="success"
                      size="small"
                      disabled={selectedAppointment?.status === "cancelled" || selectedAppointment?.status === "completed"}
                      onClick={() => { handleCompleteAppointment(selectedAppointment.id) }}
                    >
                      Complete Appointment
                    </Button>
                  </span>
                </>
              )}
            </div>

            {/* Mobile view for appointment actions */}
            <div className="md:hidden mt-4 space-y-3">
              {/* Video call button for video appointments */}
              {selectedAppointment?.appointment_type === "video" && (selectedAppointment?.status === "confirmed" || selectedAppointment?.status === "completed") && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="small"
                  disabled={selectedAppointment?.status === "cancelled"}
                  onClick={() => navigate(`/room/${selectedAppointment?.id}`, { state: { user: doctorData.doctor } })}
                  className="py-2 text-sm"
                >
                  Join Video Call
                </Button>
              )}

              {/* Prescription and Complete buttons */}
              {(selectedAppointment?.status === "confirmed" || selectedAppointment?.status === "completed") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    fullWidth
                    disabled={selectedAppointment?.status === "cancelled"}
                    onClick={() => { setSelectedAppointment(null); setPrescriptionOpen(true) }}
                    className="py-2 text-sm"
                  >
                    Create Prescription
                  </Button>

                  {selectedAppointment?.status !== "completed" && (
                    <Button
                      type="button"
                      variant="contained"
                      color="success"
                      size="small"
                      fullWidth
                      disabled={selectedAppointment?.status === "cancelled" || selectedAppointment?.status === "completed"}
                      onClick={() => { handleCompleteAppointment(selectedAppointment.id) }}
                      className="py-2 text-sm"
                    >
                      Complete Appointment
                    </Button>
                  )}
                </div>
              )}
            </div>
            {(selectedAppointment.reschedule_requested || selectedAppointment.reschedule_requested == '1')
              && <div className="w-full my-4 md:my-5 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex flex-col gap-2">
                <h1 className="font-semibold text-sm md:text-base text-yellow-800"> A Reschedule is requested.. </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">New Date:</span> {selectedAppointment?.rescheduled_date || "N/A"} </p>
                  <p><span className="font-medium">New Time:</span> {selectedAppointment?.rescheduled_time || "N/A"} </p>
                </div>
                <div className="mt-1">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    type="button"
                    className="w-full sm:w-fit py-1.5 text-xs md:text-sm"
                    onClick={() => handleAcceptReschedule(selectedAppointment?.id)}
                  >
                    Accept Reschedule
                  </Button>
                </div>
                {rescheduleSuccess && 
                  <p className="w-full p-2 bg-green-100 text-green-700 rounded text-xs md:text-sm text-center">
                    {rescheduleSuccess}
                  </p>
                }
              </div>
            }
            {(selectedAppointment?.status === "confirmed" || selectedAppointment?.status === "completed") &&
              <section className="mt-8 md:mt-12 lg:mt-16 w-full">
                <h2 className="text-lg md:text-xl font-semibold mb-3 pb-2 border-b">Chat with Patient</h2>
                <div className="bg-white rounded-lg shadow-sm">
                  <Chat doctor_id={selectedAppointment?.doctor_id} user_id={selectedAppointment?.user_id} appointmentId={selectedAppointment?.id} />
                </div>
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
        open={isPrescriptionOpen}
        onHide={() => setPrescriptionOpen(null)}
      >
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-extrabold text-center text-gray-900">Update App</h2>
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


      {/* Update Prescription */}

      <Dialog
        header=""
        visible={!!openUpdateAppointment}
        maximized
        style={{ width: "50vw" }}
        onHide={() => setOpenUpdateAppointment(null)}
        open={openUpdateAppointment}
      >
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-extrabold text-center text-gray-900">Update Appointment</h2>





            <div className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg dark:bg-gray-800 w-96 p-6 relative">
                <div className="w-full flex items-center justify-between ">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Update Appointment - id ({openUpdateAppointment?.id})</h3>
                  <button
                    onClick={() => setOpenUpdateAppointment(null)} className="text-2xl bg-transparent rounded-lg p-0 ml-auto inline-flex items-center dark:hover:text-white text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <label htmlFor="dateAppointment" className="block w-fit mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min={new Date().toISOString().split("T")[0]} // Disables past dates
                    value={state.dateAppointment || openUpdateAppointment?.appointment_date}
                    onChange={(e) => dispatch({ type: "SET_DATE", payload: e.target.value })} required
                  />

                  <label htmlFor="timeAppointment" className="block w-fit mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select Time
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={state.timeSlot.appointment_time || openUpdateAppointment?.appointment_time}
                      onChange={handleTimeChange} step="1800"
                    />
                  </div>

                  <label htmlFor="timeAppointment" className="block w-fit mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Video Fee
                  </label>
                  <input
                    type="number"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Video Fee"
                    value={state.timeSlot.video_fee || openUpdateAppointment?.video_fee}
                    onChange={(e) => dispatch({ type: "SET_TIME_SLOT", field: "video_fee", payload: e.target.value })}
                    required
                  />

                  <label htmlFor="timeAppointment" className="block w-fit mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Clinic Fee
                  </label>
                  <input
                    type="number"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Clinic Fee"
                    value={state.timeSlot.clinic_fee || openUpdateAppointment?.clinic_fee}
                    onChange={(e) => dispatch({ type: "SET_TIME_SLOT", field: "clinic_fee", payload: e.target.value })}
                    required
                  />

                  <label htmlFor="timeAppointment" className="block w-fit mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Appointment Type
                  </label>
                  <select
                    value={state.timeSlot.appointment_type || openUpdateAppointment?.appointment_type}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onChange={(e) => dispatch({ type: "SET_TIME_SLOT", field: "appointment_type", payload: e.target.value })}
                    required
                  >
                    <option value="">--Select--</option>
                    <option value="video">Video</option>
                    <option value="clinic">Clinic</option>
                  </select>

                  <button
                    type="submit"
                    className="w-full disabled:opacity-30 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    disabled={state.isLoading}
                  >
                    {state.isLoading ? "Loading..." : "Confirm Appointment"}
                  </button>
                </form>
                {state.successMessage && <AlertSucces Message={state.successMessage} />}
              </div>
            </div>





          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TableAppointment;
