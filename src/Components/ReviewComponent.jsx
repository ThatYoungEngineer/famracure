import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import PostAReview from './PostAReview';

const ReviewComponent = ({doctorId}) => {

  const [reviews, setReviews] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [reRenderCount, setReRenderCount] = useState(0)

  const fetchReviews = async (doctorId) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`https://backend.famracure.com/api/doctor/${doctorId}/reviews`);
      const data = await response.json();
      if (!response.ok && response.status === 404) {
        setError(data?.message)        
      }
      else {
        setReviews(data);
      }
    } catch (error) {
      setError("Failed to fetch reviews")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (doctorId) {
      fetchReviews(doctorId)
    }
  }, [doctorId, reRenderCount])

  const reRender = () => {
    setReRenderCount(prev => prev+1)
  }
    
  
  return loading 
  ? <div className="flex flex-col max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md h-40 my-20">
      <h1 className="text-2xl font-semibold mb-4">Patient Reviews</h1>
      <div className="flex flex-1 items-center justify-center">
        <Spinner size='xl' />
      </div>
    </div>       
  : <div>
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md my-20">
      <h1 className="text-2xl font-semibold mb-4">Patient Reviews</h1>

      {(reviews&&reviews.length>0) &&

        <section>
          <div className="bg-blue-100 p-4 rounded-lg flex items-center mb-6">
            <i className="fas fa-star text-blue-500 text-2xl mr-2"></i>
            <div>
              <p className="text-blue-500 font-semibold text-lg">100%</p>
              <p className="text-gray-600">Out of all patients who were surveyed, 100% are satisfied</p>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <div className="text-center">
              <p className="text-gray-600">Doctor Checkup (5.0)</p>
              <div className="text-yellow-500">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Waiting Time (5.0)</p>
              <div className="text-yellow-500">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </section>
      }

      <PostAReview doctorId={doctorId} handleReRender={reRender} />

      {(reviews&&reviews.length>0) 
        ? reviews.map((review) => (
          <div className="bg-gray-100 p-4 rounded-lg mb-4" key={review.id}>
            <div className="flex items-center mb-2">
              <div className="bg-gray-300 rounded-full h-10 w-10 flex items-center justify-center text-xl font-semibold text-gray-700">A</div>
              <div className="ml-4">
                <p className="font-semibold text-gray-800 capitalize">{review?.user?.firstname} {review?.user?.lastname}</p>
                <p className="text-gray-600 text-sm">
                  <p className="flex flex-col justify-center text-yellow-500">
                    <span>
                        {new Date(review?.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span>
                        {/* Filled stars */}
                        {Array.from({ length: review?.rating || 0 }, (_, i) => (
                          <span key={i} className="text-yellow-500">★</span>
                        ))}
                        
                        {/* Transparent stars */}
                        {Array.from({ length: 5 - (review?.rating || 0) }, (_, i) => (
                          <span key={i + 5} className="text-gray-300">★</span>
                        ))}

                        <span className="ml-2 text-gray-700">{review?.rating}.0</span>
                      </span>
                  </p>

                </p>
              </div>
            </div>
            <p className="text-gray-700">
              {review?.comments}
            </p>
          </div>
        ))
        : error 
          ? <p className="h-36 flex justify-center items-center text-gray-600 text-center">{error}</p>
          : ''
      }
      

      {/* Read more button */}

      {(reviews&&reviews.length>0) &&
        <div className='w-full flex items-center justify-end'>
          <p className="w-fit text-blue-500 cursor-not-allowed">
            Read More Reviews <i className="fas fa-chevron-down"></i>
          </p>
        </div>
      }
    </div>
  </div>
};

export default ReviewComponent;




// import React from 'react';

// function ReviewComponent({ selectedTime, selectedDate, doctorDetails, handleSubmit, handlePayment }) {
//   return (
//     <div className="review-section">
//       <h2>Appointment Summary</h2>
//       <div className="doctor-details">
//         <h3>Doctor: {doctorDetails.name}</h3>
//         <p>Specialization: {doctorDetails.specialite}</p>
//         <p>Fee: Rs. {doctorDetails.clinicFee}</p>
//         <p>Date: {selectedDate}</p>
//         <p>Time: {selectedTime}</p>
//       </div>
//       <button onClick={handleSubmit} className="submit-btn">Confirm Appointment</button>
//       <button onClick={handlePayment} className="payment-btn">Proceed to Payment</button>
//     </div>
//   );
// }

// export default ReviewComponent;