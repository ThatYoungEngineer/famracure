

import "../../Assets/Css/HomeCss/DoctorCard.css"; // Importing CSS for styling





const DoctorCard = () => {
  return (
    <div className="doctor-card">
      <div className="card-body">
        <div className="doctor-info">
          {/* Avatar Section */}
          <img 
            src="https://via.placeholder.com/80" 
            alt="Doctor Avatar" 
            className="doctor-avatar" 
          />

          {/* Doctor Details */}
          <div className="details">
            <h2 className="doctor-name">Dr. Abeera Ali</h2>
            <p className="specialization">Gynecologist, Obstetrician</p>
            <p className="degree">MBBS, FCPS (Gynecology and Obstetrics)</p>
            <p className="experience">8 Years Experience | 99% Satisfied Patients</p>
          </div>

          {/* Action Buttons */}
          <div className="actions">
            <button className="video-consult">Video Consult</button>
            <button className="book-appointment">Book Appointment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;





