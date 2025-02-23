import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../Assets/Css/HomeCss/DoctorProfileCard.css'; // Import the CSS file
import { Link } from "react-router-dom";

const DoctorPage = ({feeType}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`https://backend.famracure.com/api/doctor_view/${id}`);
        console.log('API Response:', response.data); // Log the API response to debug
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      }
    };

    fetchDoctorProfile();
  }, [id]);

  return (
    <div className="container-c">
      <div className="doctor-profile-card">
        {/* <img src={doctor.avatar_doctor} alt="" className="doctor-avatar" /> */}
        <img
            src="/img/doc-listing.jpg"
            className="h-[110px] w-[131px] rounded-[10px]"
            alt=""
          />

        <h2>{`Dr. ${doctor?.firstname} ${doctor?.lastname}`}</h2>
        <p>{doctor?.specialite}</p>

        {feeType === "video" ? 
        <p>Video Call Fee: {doctor?.video_fee}</p>
        :
        <p>Clinic Fee: {doctor?.clinic_fee}</p>
        }

      </div>
    </div>
  );
};

export default DoctorPage;
