// SimilarDoctors.js
import React from 'react';

// DoctorCard component to show details of each doctor
const DoctorCard = ({ name, specialty, degree, experience, consultationTime, imageUrl }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
    <img src={imageUrl} alt={`Portrait of ${name}`} className="w-20 h-20 rounded-full mr-4" />
    <div>
      <div className="flex items-center mb-2">
        <span className="bg-purple-200 text-purple-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Featured Doctor</span>
        <span className="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Verified</span>
        <button className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-800 flex items-center">
          <i className="fas fa-video mr-1"></i> Video Consultation
        </button>
      </div>
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-gray-600">{specialty}</p>
      <p className="text-sm text-gray-600">{degree}</p>
      <div className="flex items-center mt-2">
        <span className="text-sm font-semibold">{experience}</span>
        <span className="mx-2">|</span>
        <span className="text-sm font-semibold">{consultationTime}</span>
      </div>
    </div>
  </div>
);

// SimilarDoctors component to render a list of DoctorCard components
const SimilarDoctors = () => (
  <div className="max-w-7xl mx-auto p-8 bg-gray-100">
    <h2 className="text-2xl font-bold mb-6">Similar Doctors</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DoctorCard
        name="Dr. Ellen Scotts"
        specialty="Dermatologist • Aesthetic Medicine Specialist"
        degree="MBBS, MS"
        experience="6 Years"
        consultationTime="15-30 mins"
        imageUrl="https://placehold.co/100x100"
      />
      <DoctorCard
        name="Dr. Muhammad Usman"
        specialty="Cardiologist • Heart Specialist"
        degree="MBBS, MD"
        experience="10 Years"
        consultationTime="20-40 mins"
        imageUrl="https://placehold.co/100x100"
      />
      {/* Add more DoctorCard components as needed */}
    </div>
  </div>
);

export default SimilarDoctors;
