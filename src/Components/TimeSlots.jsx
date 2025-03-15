import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Assets/Css/HomeCss/TimeSlots.css";
import axiosClient from "../AxiosClient";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TimeSlots({ doctorId, doctorDetails, feeType, setSelectedTime, setSelectedDate }) {
  const currentDate = new Date().toISOString().split("T")[0];
  const [selectedDateState, setSelectedDateState] = useState(currentDate);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


const [availableDates, setAvailableDates] = useState(null)

const fetchAvailableDates = () => {
  axiosClient
  .get(`/doctors/${doctorId}/available-dates`)
   .then(response => {
      console.log('available dates from the new api: ', response.data.available_dates)
      setAvailableDates(response?.data?.available_dates)
    })
   .catch(err => {
      console.error('Error fetching available dates: ', err)
    })
}


  // Handle date change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDateState(date);
    setSelectedDate(date);
    setSlots([]); // ✅ Clear previous slots before fetching new ones
  };

  // Fetch available slots when the date changes
  useEffect(() => {
    fetchAvailableDates()
    const fetchSlots = async () => {
      if (!selectedDateState) return;

      setLoading(true);
      setError(null);
      setSlots([]); // ✅ Reset slots before fetching new data

      try {
        const response = await axios.get(`https://backend.famracure.com/api/doctor/${doctorId}/available-slots/${selectedDateState}`);

        console.log("API Response hai ye:", response.data); // Debugging

        if (response.status === 200 && response.data.available_slots) {
          setSlots(response.data.available_slots);
        } else {
          setSlots([]); // No available slots
        }
      } catch (err) {
        console.log('err: ', err)
        if (err?.response?.data?.message) {
          setError(err?.response?.data?.message);
        } else {
          setError("Error fetching slots");
          console.error("Error fetching slots:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDateState, doctorId]);

  // Handle slot click
  const handleSlotClick = (slot) => {
    if (slot.status !== "pending") {
      return;
    }

    setSelectedTime(slot.appointment_time);

    navigate("/onlinepayment", {
      state: {
        appointmentId: slots[0]?.id,
        doctorDetails,
        selectedDate: selectedDateState,
        selectedSlot: slot.appointment_time,
        feeType,
        appointmentFee: feeType === 'video' ? slot.video_fee : slot.clinic_fee,
      },
    });
  };

  function convertTo12Hour(time) {
    const [hour, minute] = time.split(":");
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${formattedHour}:${minute} ${ampm}`;
}

  
  return (
    <div className="available-slots">
      <h2 className="my-5 text-lg">Select highlighted date to view available slots</h2>
      {/* <input
        type="date"
        onChange={handleDateChange}
        value={selectedDateState}
        className="date-input"
        min={currentDate} // Prevent selecting past dates
      /> */}

      <div className="flex w-full">
        <DatePicker
          selected={selectedDateState}
          onChange={(date) => {
            if (!date) return; // Ensure date is valid
            const formattedDate = date.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD'
            setSelectedDateState(formattedDate);
            setSelectedDate(formattedDate);
            setSlots([]);
          }}
          includeDates={availableDates?.map(date => new Date(date))} // Convert available dates to Date objects
          minDate={new Date()} // Prevent selecting past dates
          dateFormat="yyyy-MM-dd"
          className="flex-1 !w-[33vw] cursor-pointer"
        />
      </div>

      {loading && <p className="my-5 text-center text-gray-500">Loading slots...</p>}
      {error && <p className="error my-5">{error}</p>}

      <div className="slots-container">
        {slots?.length > 0 && <h3>Available Slots</h3> }
        {(slots && slots?.length > 0) && (
          <ul className="slots-list">
            {slots?.map((slot) => (
              <li
                key={slot.id}
                className={`slot-item ${slot.status !== "pending" ? "booked" : ""}`}
                onClick={() => handleSlotClick(slot)}
                style={{ cursor: slot.status !== "pending" ? "not-allowed" : "pointer" }}
              >
                {convertTo12Hour(slot?.appointment_time.slice(0, 5))}

                {/* {slot.appointment_time}{" "} */}
                {slot.status !== "pending" && <span className="booked-label">Booked</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TimeSlots;