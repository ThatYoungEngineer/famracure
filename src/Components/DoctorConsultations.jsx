import React from 'react';
import "../Assets/Css/HomeCss/DoctorConsultations.css"; // Import CSS for styling
import { Header, Footer } from "../Components"; // Reuse your header and footer
import FooterTopBar from "../Components/FooterTopBar";
const DoctorConsultations = () => {
  const consultations = [
    { 
      id: 1, 
      name: 'Dental Care', 
      description: 'Professional dental services to maintain oral hygiene.', 
      image: '/img/Rectangle 6.jpg' 
    },
    { 
      id: 2, 
      name: 'Cardiology', 
      description: 'Heart health consultations and check-ups.', 
      image: '/img/cardiology.jpg' 
    },
    { 
      id: 3, 
      name: 'Dermatology', 
      description: 'Skin care solutions and consultations.', 
      image: '/img/dermatology.jpg' 
    },
    { 
      id: 4, 
      name: 'Pediatrics', 
      description: 'Medical care for children and infants.', 
      image: '/img/pediatrics.jpg' 
    },
    { 
      id: 5, 
      name: 'Orthopedics', 
      description: 'Treatment of bone and joint issues.', 
      image: '/img/orthopedics.jpg' 
    },
    { 
      id: 6, 
      name: 'ENT', 
      description: 'Consultations for ear, nose, and throat issues.', 
      image: '/img/ent.jpg' 
    },
  ];

  return (
    <>
      <Header />
      <h1
      style={{
        textAlign:'center',
        backgroundColor:'#587FD9',
        fontSize:'26px',
        color:'#ffffff',
        padding:'10px'
      }}
      ><b>Consults With Best Doctors</b></h1>
      <div className="consultations-container">
        {consultations.map((consultation) => (
          <div key={consultation.id} className="card1">
            <img 
              src={consultation.image} 
              alt={consultation.name} 
              className="card-image" 
            />
            <div className="card-content">
              <h2 className="card-title">{consultation.name}</h2>
              <p className="card-description">{consultation.description}</p>
            </div>
          </div>
        ))}
      </div>
      <FooterTopBar/>
      <Footer />
    </>
  );
};

export default DoctorConsultations;
