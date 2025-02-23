import React from 'react';

function DoctorAppointmentBooking() {
  return (
    <div className="bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="speciality">
            Speciality
          </label>
          <select className="block w-full p-2 border border-gray-300 rounded-md" id="speciality">
            <option>Dermatologist</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="area">
            Area
          </label>
          <select className="block w-full p-2 border border-gray-300 rounded-md" id="area">
            <option>All Areas</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Gender
          </label>
          <div className="flex items-center mb-2">
            <input className="mr-2" id="female" type="checkbox" />
            <label className="text-gray-700" htmlFor="female">
              Female
            </label>
          </div>
          <div className="flex items-center">
            <input className="mr-2" id="male" type="checkbox" />
            <label className="text-gray-700" htmlFor="male">
              Male
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Availability
          </label>
          <div className="flex items-center mb-2">
            <input className="mr-2" id="available-today" type="checkbox" />
            <label className="text-gray-700" htmlFor="available-today">
              Available Today
            </label>
          </div>
          <div className="flex items-center">
            <input className="mr-2" id="available-tomorrow" type="checkbox" />
            <label className="text-gray-700" htmlFor="available-tomorrow">
              Available Tomorrow
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="doctor-fee-range">
            Doctor Fee Range
          </label>
          <select className="block w-full p-2 border border-gray-300 rounded-md" id="doctor-fee-range">
            <option>All</option>
          </select>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-6 text-center">
        <img
          src="https://placehold.co/100x100"
          alt="Placeholder image of a calendar with a question mark"
          className="mx-auto mb-4"
          width="100"
          height="100"
        />
        <h2 className="text-gray-700 font-medium mb-2">
          Book Your Appointment
        </h2>
        <p className="text-gray-500 mb-4">
          This doctor is not available at the moment. Please click below to view similar and most experienced doctors.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
          View Similar Doctors
        </button>
      </div>
    </div>
  );
}

export default DoctorAppointmentBooking;
