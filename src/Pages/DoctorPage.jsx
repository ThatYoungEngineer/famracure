import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Footer, Header } from '../Components';
import FAQSection from '../Components/FAQSection';
import FooterTopBar from "../Components/FooterTopBar";
import ReviewComponent from '../Components/ReviewComponent';
import DoctorInfoComponent from '../Components/DoctorInfoComponent';
import SimilarDoctors from '../Components/SimilarDoctors';

const AvailabilityBadge = ({ available }) => (
  <div className={`flex items-center text-xs font-medium rounded-full px-2 py-0.5 w-fit
    ${available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
    <span className={`w-3 h-3 mr-1 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`}></span>
    {available ? "Available" : "Not Available"}
  </div>
);

const DoctorPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    axios.get(`https://backend.famracure.com/api/doctor_view/${id}`)
      .then((response) => {
        if (response) {
          setDoctor(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);

  console.log('doctor: ', doctor); // Log the doctor data to debug

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!doctor) return <div className="text-center mt-10 text-red-500">Doctor not found.</div>;

  return (
    <>
      <Header />
      <h1 className="text-center text-2xl mt-12 font-bold">Connect with Best Neurology</h1>

      <div className="container mx-auto my-10 px-4 md:px-6">
        <div className="relative bg-cover bg-no-repeat h-80 bg-center"></div>

        <div className="container px-4 md:px-12 -mt-72">
          <div className="block rounded-lg bg-white border border-gray-200 shadow-lg p-8 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-10">
              
              {/* Doctor Image */}
              <div className="w-full lg:w-1/3 flex justify-center">
                <img src={doctor?.avatar_doctor ? doctor?.avatar_doctor : "/img/doc-listing.jpg"} alt="Doctor profile" className="shadow-lg object-cover w-[131px] h-[110px]" />
              </div>
              
              {/* Doctor Details */}
              <div className="w-full lg:w-2/3 flex flex-col space-y-4">
                <AvailabilityBadge available={doctor?.available} />
                <h2 className="font-bold text-xl">Dr. {doctor?.firstname} {doctor?.lastname}</h2>
                <p className="text-gray-700">{doctor?.specialite}</p>
                <p className="text-gray-600">{doctor?.qualifications}</p>
                <p className="font-semibold text-gray-800">
                  {doctor?.experience_years} Years Experience | {doctor?.satisfaction_percentage}% Satisfied Patients
                </p>
              </div>

              {/* Video Consultation Section */}
              <div className="w-full lg:w-2/5 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <i className="fas fa-video text-blue-500 text-2xl mr-2"></i>
                  <h1 className="text-xl font-semibold text-blue-500">Online Video Consultation</h1>
                </div>
                <div className="flex justify-end mb-4">
                  <div className="bg-blue-100 text-blue-500 text-xs px-2 py-1 rounded text-center">
                    I'm Online <br /> 12:00 - 02:00
                  </div>
                </div>
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-gray-500">Fee:</span>
                  <span className="text-gray-900 font-semibold">${doctor?.video_fee || "Not Available"}</span>
                </div>
                <div className="mb-4 flex justify-between gap-2">
                  <span className="text-gray-500">Address:</span>
                  <span className="text-gray-900 text-right">{doctor?.address_cabinet}</span>
                </div>
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-gray-500">Available today</span>
                  <AvailabilityBadge available={doctor?.available} />
                </div>

                <Link to={`/bookingappointment/${id}`} className="block">
                  <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600">
                    Book Video Consultation
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewComponent doctorId={id} />
      <DoctorInfoComponent doctorId={id} />
      <FAQSection />
      <SimilarDoctors />
      <FooterTopBar />
      <Footer />
    </>
  );
};

export default DoctorPage;
