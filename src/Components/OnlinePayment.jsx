import { useEffect, useState } from "react";
import { Footer, Header } from "../Components"; // Ensure this import is correct

import axiosClient from "../AxiosClient";
import { useLocation, useNavigate } from "react-router";

import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe("pk_test_51QyyZBIW1ezGv3xAIl0w4t54mSwgZv8jf51jWg385jNAJXaoXQ7G8HRU0lgPxTQtTZp4d6EhiN2YJS1xe1D6GbGp008Ju0Qbb0");


const PaymentForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [persistedData, setPersistedData] = useState(null);
  
  const stripe = useStripe();
  const elements = useElements();

  const location = useLocation();
  const navigate = useNavigate();



  useEffect(() => {
    if (location?.state) {
      setPersistedData(location?.state);
    }  else {
      navigate("/search-doctor");
    }
  }, [location.state]);

  const handlePayNow = async () => {
    setError("")
    setSuccess("")
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      // Create payment method
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        console.error("Payment method creation error:", error);
        setIsLoading(false);
        return;
      }

      const formattedTime = persistedData?.selectedSlot?.slice(0, 5);

      const paymentDetails = {
        doctor_id: persistedData?.doctorDetails?.id,
        appointment_date: persistedData?.selectedDate,
        appointment_time: formattedTime,
        appointment_type: persistedData?.feeType,
        payment_method_id: paymentMethod.id, // Send this to backend
      };

      const response = await axiosClient.post(`/book-appointment`, paymentDetails);
      if (response?.data?.message) {
        setSuccess(response?.data?.message);
      } 
    } catch (err) {
      const error = err?.response?.data?.message
      if (error) setError(error)
      else setError("Network Error")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded">
      {(success || error) && 
        <section>
          <div className={`w-fit text-center px-4 py-2 rounded-lg mx-auto mb-8 
            ${error ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"}`}
          >
            {error ? error : success}
          </div>
        </section>
      }
      <CardElement className="border p-2 py-5 rounded mb-4" />
      <button className="bg-gray-700 text-white p-2 rounded w-full" onClick={handlePayNow} disabled={isLoading}>
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};


const PaymentPage = () => {
  
  const [persistedData, setPersistedData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location?.state) {
      setPersistedData(location?.state);
    } else {
      navigate("/search-doctor");
    }
  }, [location.state]);

  const formattedTime = persistedData?.selectedSlot?.slice(0, 5);

  return (
    <section className="w-screen min-h-screen flex flex-col justify-between">
      <Header />
      
      <div className="container p-4">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <div className="bg-white p-4 rounded shadow border">
              <div className="flex items-center mb-4">
                <img
                  alt="Doctor's profile"
                  className="rounded-full mr-4 w-16 h-16 object-cover"
                  src={`https://backend.famracure.com/images/doctors/${persistedData.doctorDetails.avatar_doctor}` || "/img/doc-listing.jpg" } 
                />
                <div>
                  <h3 className="text-lg font-semibold">{persistedData?.doctorDetails?.name || "Unknown" }</h3>
                  <p className="text-gray-600"> 
                    { persistedData?.feeType === 'video' 
                    ? "Online Video Consultation"
                    : "Clinic Consultation"
                    }
                  </p>
                  <p className="text-gray-600 flex gap-2 items-center">
                    <i className="far fa-clock"></i> 
                    <span className="flex gap-2">
                      <p>{persistedData?.selectedDate || "N/A" }</p>
                      <p>@ {formattedTime || "N/A" }</p>
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">${persistedData?.appointmentFee || "N/A" }</p>
                <Elements stripe={stripePromise}>
                  <PaymentForm />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default PaymentPage;
