import React, { useReducer } from "react";
import axiosClient from "../../../AxiosClient";
import AlertSucces from "../../Alert/AlertSucces";

const initialState = {
  dateAppointment: "",
  timeSlot: {
    appointment_time: "",
    video_fee: "",
    clinic_fee: "",
    appointment_type: ""
  },
  isLoading: false,
  successMessage: ""
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATE":
      return { ...state, dateAppointment: action.payload };
    case "SET_TIME_SLOT":
      return { ...state, timeSlot: { ...state.timeSlot, [action.field]: action.payload } };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SUCCESS_MESSAGE":
      return { ...state, successMessage: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const AjouterModel = ({ show, setShow }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const postAppointment = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_SUCCESS_MESSAGE", payload: "" });
    try {
      const response = await axiosClient.post("/doctor/appointments/create", {
        appointment_date: state.dateAppointment,
        time_slots: [state.timeSlot]
      });
      
      if (response?.data?.message) {
        dispatch({ type: "SET_SUCCESS_MESSAGE", payload: response.data.message });
      }
    } catch (error) {
      console.error("Error posting appointment:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.dateAppointment || !state.timeSlot.appointment_time) {
      alert("Please enter both date and time.");
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

  return (
    show && (
      <div className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-800 w-96 p-6 relative">
          <div className="w-full flex items-center justify-between ">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select Appointment</h3>
            <button 
              onClick={() => setShow(false)} className="text-2xl bg-transparent rounded-lg p-0 ml-auto inline-flex items-center dark:hover:text-white text-gray-500 hover:text-gray-700"
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
              max={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0]} 
              value={state.dateAppointment} 
              onChange={(e) => dispatch({ type: "SET_DATE", payload: e.target.value })} required 
            />
            <label htmlFor="timeAppointment" className="block w-fit mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select Time
            </label>
            <input 
              type="time" 
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={state.timeSlot.appointment_time} 
              onChange={handleTimeChange} step="1800" 
              required 
            />
            <label htmlFor="timeAppointment" className="block w-fit mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Video Fee
            </label>
            <input 
              type="number" 
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Video Fee" value={state.timeSlot.video_fee} 
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
              value={state.timeSlot.clinic_fee} 
              onChange={(e) => dispatch({ type: "SET_TIME_SLOT", field: "clinic_fee", payload: e.target.value })} 
              required 
            />
            <label htmlFor="timeAppointment" className="block w-fit mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Appointment Type
            </label>
            <select
              value={state.timeSlot.appointment_type} 
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
    )
  );
};

export default AjouterModel;
