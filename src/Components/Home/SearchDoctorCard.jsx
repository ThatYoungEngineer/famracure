import React from "react";
import { ClockIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FAQSection from '../FAQSection'; 

const SearchDoctorCard = ({

  id,
  avatar_doctor,
  firstname,
  lastname,
  qualifications,
  experience_years,
  satisfaction_percentage,
  day_debut_work,
  day_fin_work,
  specialite,
  available,
  time_fin_work,
  time_debut_work,
  video_fee,
  clinic_fee
}) => {
  const { t } = useTranslation();
  console.log("Props received in SearchDoctorCard:", {
    firstname,
    lastname,
    qualifications,
    experience_years,
    satisfaction_percentage,
    day_debut_work,
    day_fin_work,
    time_debut_work,
    time_fin_work,
    specialite,
    available,
    video_fee,
    clinic_fee
});

console.log("avatar_doctor: ", avatar_doctor);

  return (
    <>
      <div className="mx-auto p-4 w-full relative rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white capitalize border border-gray-200">

        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex">
          <div className="avalible">
            {available ? (
              <div className="bg-green-100 flex items-center text-green-800 text-xs font-medium rounded-full px-2 py-0.5">
                <span className="flex w-3 h-3 bg-green-500 mr-1 rounded-full"></span>
                {t("SearchDoctorCard.Available")}
              </div>
            ) : (
              <div className="bg-gray-100 flex items-center text-gray-800 text-xs font-medium rounded-full px-2 py-0.5">
                <span className="flex w-3 h-3 bg-red-500 mr-1 rounded-full"></span>
                {t("SearchDoctorCard.Not_Available")}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Doctor Image - Left side */}
          <div className="card-img flex-shrink-0">
            <img
              src={avatar_doctor !== null ? `https://backend.famracure.com/images/doctors/${avatar_doctor}` : "/img/doc-listing.jpg"}
              className="h-[120px] w-[140px] rounded-lg object-cover"
              alt="Doctor"
            />
          </div>

          {/* Doctor Details - Right side */}
          <div className="doctor-card-detail flex-grow text-left">
            <h1 className="doctor-name text-lg font-bold">Dr. {firstname} {lastname}</h1>
            <p className="specialization text-blue-600 font-medium">{specialite}</p>
            <p className="degree text-gray-600 text-sm mt-1">{qualifications}</p>
            <p className="experience text-gray-700 text-sm mt-2">
              <span className="font-medium">{experience_years} years experience</span>
              <span className="mx-2">|</span>
              <span className="font-medium">15-30 minutes</span>
            </p>
          </div>
        </div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t border-gray-100 pt-4">
  <div className="consultation-option bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors">
    <Link 
      to={`/bookingappointment/${id}`} 
      state={{ feeType: "video", fee: video_fee }}
      className="block"
    >
      <div className="flex items-center mb-2">
        <img
          src="/img/Layer 2.png"
          className="w-6 h-6 mr-2"
          alt="Video Icon"
        />
        <h1 className="text-blue-800 text-sm sm:text-base font-medium">Video Consultation</h1>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 mr-1 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <p className={`${available ? 'text-green-700' : 'text-gray-700'} text-xs font-medium`}>
            {available ? 'Available today' : 'Not available'}
          </p>
        </div>
        <p className="text-blue-900 font-bold">Rs. {video_fee}</p>
      </div>
    </Link>
  </div>

  <div className="consultation-option bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
    <Link 
      to={`/bookingappointment/${id}`} 
      state={{ feeType: "clinic", fee: clinic_fee }}
      className="block"
    >
      <div className="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h1 className="text-gray-800 text-sm sm:text-base font-medium">Won Aesthetics Clinic</h1>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 mr-1 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <p className={`${available ? 'text-green-700' : 'text-gray-700'} text-xs font-medium`}>
            {available ? 'Available today' : 'Not available'}
          </p>
        </div>
        <p className="text-gray-900 font-bold">Rs. {clinic_fee}</p>
      </div>
    </Link>
  </div>
</div>

<div className="mt-6">
  <Link to={`/doctor/View_Profile/${id}`} className="block w-full">
    <button className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow">
      {t("SearchDoctorCard.View_Profile")}
    </button>
  </Link>
</div>
      </div>



    </>

  );


};

export default SearchDoctorCard;
