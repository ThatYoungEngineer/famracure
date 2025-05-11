import React from "react";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Section = () => {
  const { t } = useTranslation();
  const doctorData = useSelector((state) => state.AuthDoctor);

  return (
    <div className="bg-white flex flex-col md:flex-row border drop-shadow-sm rounded-lg my-4 md:my-6 mx-2 md:mx-4 p-4 md:p-0 md:h-40">
      <div className="md:mt-4 p-2 md:p-4 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <p className="font-medium text-lg md:text-xl text-gray-900">
            {t("Section_Doctor.Welcome_Doctor")}{" "}
            <span className="inline-block px-2 text-white bg-[#0D63F3] font-semibold rounded dark:bg-blue-500">
              Dr. {doctorData.doctor != null ? doctorData.doctor.firstname : ""}
            </span>{" "}
            {t("Section_Doctor.in_DocAppoint")}
          </p>
          <HandThumbUpIcon className="h-6 w-6 text-gray-500 hidden sm:block" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mt-2 font-normal">
          {t("Section_Doctor.Appointments_Today")}
        </p>
      </div>
      <div className="flex justify-center md:justify-end items-center flex-shrink-0 mt-4 md:mt-0">
        <img
          src="/img/sammy-doctors-consultation.png"
          className="h-24 md:h-32 lg:h-40 md:ml-4 lg:ml-8"
          alt="Doctor consultation illustration"
        />
      </div>
    </div>
  );
};

export default Section;