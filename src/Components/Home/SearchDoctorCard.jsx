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
      <div className="border_card mx-auto p-4 w-[372px]  relative text-center  capitalize">
      
      {/* <div className="absolute top-[12px] right-0 flex items-center b-card">
  <Link to={`/bookingappointment/${id}`}>
    <button className="mr-3 px-[32px] py-[9px] text-white  font-medium text-[13px] flex items-center"
    style={{
      border:'1px solid #0d63f3',
      color:'#0d63f3',
    }}
    >
      <img
        src={"/img/Layer 2.png"}
        style={{
          width: '26px',
          marginRight: '8px', // Adjust spacing between image and text
        }}
        alt=""
      />
      {t("SearchDoctorCard.Book_Now")}
    </button>
  </Link>
</div> */}

<div className="absolute top-[12px] right-100 flex"
  style={{
    width: '130px',
  }}
>

          <div className="avalible">
        {available ? (
          <div className="bg-green-100 flex items-center text-green-800 text-xs font-medium rounded-full px-2 py-0.5">
            <span className="flex w-3 h-3 bg-green-500 mr-1 rounded-full"></span>
            {t("SearchDoctorCard.Available")}
          </div>
        ) : (
          <div className="bg-gray-100 flex items-center text-gray-800 text-xs font-medium rounded-full px-2 py-0.5
          
          "
         
          >
            <span className="flex w-3 h-3 bg-red-500 mr-1 rounded-full"></span>
            {t("SearchDoctorCard.Not_Available")}
          </div>
        )}
      </div>
        
        
        </div>
        <div className="doctor-card-detail">
          
<h1 className="doctor-name"><b>Dr. {firstname}</b></h1>
<p className="specialization">{specialite}</p>
<p className="degree">{qualifications}</p>

<p className="experience">
  <b>{experience_years} years&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15-30 minutes</b>
</p>



        </div>
      
       
        <div style={{ marginTop: '-116px' }} className="card-img">
          <img
            src={avatar_doctor !== null ? `https://backend.famracure.com/images/doctors/${avatar_doctor}` : "/img/doc-listing.jpg"}
            className="h-[110px] w-[131px] rounded-[10px]"
            alt=""
          />

          
        </div>
<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px', // Adjust this value to increase the space between items
    marginTop: '25px'
  }}
>

  
<div className="vedio-cal" style={{ flex: '1', textAlign: 'center' }}>
  <Link 
    to={`/bookingappointment/${id}`} 
    state={{ feeType: "video", fee: video_fee }} // ✅ Pass state correctly
  >
    <img
      src="/img/Layer 2.png"
      style={{
        width: '26px',
        position: 'absolute',
      }}
      alt="Video Icon"
    />
    <h1 style={{ color: '#000' }}>Video Consultation</h1>
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
      <div
        className={`w-3 h-3 mr-1 rounded-full ${
          available ? 'bg-green-500' : 'bg-red-500'
        }`}
      ></div>
      <p
        style={{ marginTop: '2px' }}
        className={`${
          available ? 'text-blue-800' : 'text-gray-800'
        } text-xs font-medium rounded-full px-2 py-0.5 flex items-center v-p`}
      >
        {available ? 'Available today' : 'Not available'}
      </p>
      <p className="degree-1">Rs. {video_fee}</p>
    </div>
  </Link>
</div>

<div className="vedio-cal" style={{ flex: '1', textAlign: 'center' }}>
  <Link 
    to={`/bookingappointment/${id}`} 
    state={{ feeType: "clinic", fee: clinic_fee }} // ✅ Pass state correctly
  >
    <h1 style={{ color: '#000', textAlign: 'justify' }}>Won Aesthetics Clinic</h1>
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
      <div
        className={`w-3 h-3 mr-1 rounded-full ${
          available ? 'bg-green-500' : 'bg-red-500'
        }`}
      ></div>
      <p
        style={{ marginTop: '2px' }}
        className={`${
          available ? 'text-blue-800' : 'text-gray-800'
        } text-xs font-medium rounded-full px-2 py-0.5 flex items-center v-p`}
      >
        {available ? 'Available today' : 'Not available'}
      </p>
      <p className="degree-1">Rs. {clinic_fee}</p>
    </div>
  </Link>
</div>



</div>



        
<br></br>
        <div >
        <Link to={`/doctor/View_Profile/${id}`}>
            <button className="px-[32px] py-[7px] border-[2px] border-[#0D63F3] text-[#0D63F3]  font-medium text-[13px]" style={{
          width:'100%',
          backgroundColor:'#1c64f2',
          color:'white',
          padding:'10px',
        }}>
              {t("SearchDoctorCard.View_Profile")}
            </button>
          </Link>
        </div>
      </div>

      
      
    </>
    
  );

 
};

export default SearchDoctorCard;

