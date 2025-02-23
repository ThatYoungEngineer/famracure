import React, { useState } from 'react';
import '../Assets/Css/HomeCss/DoctorCards.css'; // Import your CSS for styling

const OnlineConsultationCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAvailability = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="appointment-card">
      <div className="card-body">
        <div className="header d-flex align-items-center">
          <svg
            width="26"
            height="27"
            viewBox="0 0 26 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1884 14.6318L15.4218 14.1483V15.0547V16.84H6.78V10.16H15.4218V11.9453V12.8517L16.1884 12.3682L19.22 10.4566V16.5434L16.1884 14.6318ZM4.16101 4.66101L4.16097 4.66104C1.80117 7.02134 0.5 10.1619 0.5 13.5C0.5 15.7171 1.08351 17.8796 2.19234 19.7836L0.550138 24.7102L0.549875 24.711C0.433465 25.0622 0.524286 25.4501 0.787087 25.7129C0.974103 25.8999 1.22435 26 1.48 26C1.58411 26 1.68838 25.9833 1.78841 25.9503L1.78979 25.9499L6.7164 24.3077C8.62036 25.4165 10.7829 26 13 26C16.338 26 19.4787 24.6993 21.839 22.339C24.1993 19.9787 25.5 16.838 25.5 13.5C25.5 10.162 24.1993 7.02135 21.839 4.66101C19.4787 2.30066 16.338 1 13 1C9.66197 1 6.52135 2.30066 4.16101 4.66101Z"
              fill="#000066"
              stroke="white"
            />
          </svg>
          <h3 className="heading">
            <a href="https://oladoc.com/pakistan/video-consultation/h/4681/4681">
              Online Video Consultation
            </a>
          </h3>
        </div>

        <table className="info-table">
          <tbody>
            <tr>
              <td>Fee:</td>
              <td className="font-weight-bold">Rs. 1,400</td>
            </tr>
            <tr>
              <td>Address:</td>
              <td>laptop for video call</td>
            </tr>
          </tbody>
        </table>

        <button className="availability-toggle" onClick={toggleAvailability}>
          Available Tomorrow — 11:00 AM - 04:00 PM
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path
              d="M0.244141 1.92239L4.99997 6.67822L9.75581 1.92239L8.57747 0.744056L4.99997 4.32156L1.42247 0.744056L0.244141 1.92239Z"
              fill="#232426"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="availability-details">
            <table className="availability-table">
              <tbody>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"].map((day) => (
                  <tr key={day}>
                    <td>{day}</td>
                    <td>11:00 AM - 04:00 PM</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <a href="/appointment/4681/2250148" className="book-btn">
          <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <use xlinkHref="#video-chat-icon" />
          </svg>
          Book Video Consultation
        </a>
      </div>
    </div>
  );
};

export default OnlineConsultationCard;
