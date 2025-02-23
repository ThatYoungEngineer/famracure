// AppointmentSelection.js
import React, { useState } from 'react';
import '../Assets/Css/HomeCss/AppointmentSelection.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const dates = ['Oct, 23', 'Oct, 24', 'Oct, 25', 'Oct, 26', 'Oct, 27'];
const morningSlots = ['11:00 AM', '11:20 AM', '11:40 AM'];
const afternoonSlots = ['12:00 PM', '12:20 PM', '12:40 PM', '01:00 PM'];

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleDateClick = (date) => setSelectedDate(date);

  const handleTimeClick = (time) => {
    // Redirect to the payment page with selected data
    navigate('/payment', { state: { date: selectedDate, time } });
  };

  return (

  
    



    <div className="appointment-container">
      <h2>Select Date and Time</h2>

      <div className="date-selector">
        {dates.map((date, index) => (
          <button
            key={index}
            className={`date-button ${selectedDate === date ? 'active' : ''}`}
            onClick={() => handleDateClick(date)}
          >
            {date}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="time-slot-container">
          <h3>Morning Slots</h3>
          <div className="time-slots">
            {morningSlots.map((slot, index) => (
              <button
                key={index}
                className="time-button"
                onClick={() => handleTimeClick(slot)}
              >
                {slot}
              </button>
            ))}
          </div>

          <h3>Afternoon Slots</h3>
          <div className="time-slots">
            {afternoonSlots.map((slot, index) => (
              <button
                key={index}
                className="time-button"
                onClick={() => handleTimeClick(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
