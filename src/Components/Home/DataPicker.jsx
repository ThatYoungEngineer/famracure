import React, { useEffect } from "react";
import Datepicker from "flowbite-datepicker/Datepicker";

const DatePicker = ({ setSelectedDate }) => {

  useEffect(() => {
    const datepickerEl = document?.getElementById("datepickerId");
    new Datepicker(datepickerEl, {
      autohide: true,
    });
  }, []);

  return (
    <>
      <input
        datepicker="true"
        datepicker-autohide="true"
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 p-2"
        placeholder="Select Date"
        id="datepickerId"
        onSelect={(e) => setSelectedDate(e.target.value)}
      />
    </>
  );
};

export default DatePicker;
