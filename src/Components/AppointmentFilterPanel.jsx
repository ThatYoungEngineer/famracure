import React, { useState, useEffect } from 'react';

function AppointmentFilterPanel({ handleChangeData, specialitiesList, areasList }) {
  const [gender, setGender] = useState({ male: false, female: false });
  const [availability, setAvailability] = useState({ today: false, tomorrow: false });
  const [feeRange, setFeeRange] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [area, setArea] = useState('');

  const handleGenderChange = (event) => {
    const { id, checked } = event.target;
    setGender((prevGender) => ({ ...prevGender, [id]: checked }));
    handleChangeData(event);  // Update parent state and trigger search
  };

  const handleAvailabilityChange = (event) => {
    const { id, checked } = event.target;
    setAvailability((prevAvailability) => ({ ...prevAvailability, [id]: checked }));
    handleChangeData(event);  // Update parent state and trigger search
  };

  const handleSpecialtyChange = (event) => {
    const { value } = event.target;
    setSpecialty(value);
    handleChangeData(event);  // Trigger search after specialty change
  };

  const handleAreaChange = (event) => {
    const { value } = event.target;
    setArea(value);
    handleChangeData(event);  // Trigger search after area change
  };

  const handleFeeRangeChange = (event) => {
    const { value } = event.target;
    setFeeRange(value);
    handleChangeData(event);  // Trigger search after fee range change
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-80" style={{ position: 'relative', right: '18%' }}>
      {/* Specialty Filter */}
     

      {/* Area Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="area">Area</label>
        <select
          className="block w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 text-gray-700"
          id="area"
          value={area}
          onChange={handleAreaChange}
        >
          <option value="">All Areas</option>
          {areasList.map((area, idx) => (
            <option key={idx} value={area}>{area}</option>
          ))}
        </select>
      </div>

      {/* Gender Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Gender</label>
        <div className="flex items-center mb-2">
          <input
            className="form-checkbox h-4 w-4 text-blue-600"
            id="female"
            type="checkbox"
            checked={gender.female}
            onChange={handleGenderChange}
          />
          <label className="ml-2 text-gray-700" htmlFor="female">Female</label>
        </div>
        <div className="flex items-center">
          <input
            className="form-checkbox h-4 w-4 text-blue-600"
            id="male"
            type="checkbox"
            checked={gender.male}
            onChange={handleGenderChange}
          />
          <label className="ml-2 text-gray-700" htmlFor="male">Male</label>
        </div>
      </div>

      {/* Availability Filter */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Availability</label>
        <div className="flex items-center mb-2">
          <input
            className="form-checkbox h-4 w-4 text-blue-600"
            id="available-today"
            type="checkbox"
            checked={availability.today}
            onChange={handleAvailabilityChange}
          />
          <label className="ml-2 text-gray-700" htmlFor="available-today">Available Today</label>
        </div>
        <div className="flex items-center">
          <input
            className="form-checkbox h-4 w-4 text-blue-600"
            id="available-tomorrow"
            type="checkbox"
            checked={availability.tomorrow}
            onChange={handleAvailabilityChange}
          />
          <label className="ml-2 text-gray-700" htmlFor="available-tomorrow">Available Tomorrow</label>
        </div>
      </div>

      {/* Fee Range Filter */}
      {/* <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="fee-range">Doctor Fee Range</label>
        <select
          className="block w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 text-gray-700"
          id="fee-range"
          value={feeRange}
          onChange={handleFeeRangeChange}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div> */}
    </div>
  );
}

export default AppointmentFilterPanel;
