import React from 'react';
import '../Assets/Css/HomeCss/DoctorInfoComponent.css';

const DoctorInfoComponent = () => {
  const doctorDetails = {
    name: 'Dr. Emily Johnson',
    specialization: 'Cardiologist',
    about: `Dr. Emily Johnson has over 15 years of experience in diagnosing and treating cardiovascular conditions. 
            She is passionate about patient care and ensures that every patient receives the best possible treatment.`,
    education: [
      {
        degree: 'MBBS',
        institution: 'Harvard Medical School',
        year: '2005',
      },
      {
        degree: 'MD - Cardiology',
        institution: 'Johns Hopkins University',
        year: '2010',
      },
      {
        degree: 'Fellowship - Interventional Cardiology',
        institution: 'Mayo Clinic',
        year: '2014',
      },
    ],
  };

  return (
    <div className="doctor-info-container">
      <h2>About the Doctor</h2>
      <p className="doctor-about">{doctorDetails.about}</p>

      <h2>Education</h2>
      <ul className="education-list">
        {doctorDetails.education.map((edu, index) => (
          <li key={index} className="education-item">
            <h4>{edu.degree}</h4>
            <p>{edu.institution}</p>
            <span>{edu.year}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorInfoComponent;
