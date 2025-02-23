import React, { useEffect, useState } from "react";
import { DataPicker, Footer, Header, TimePicker } from "../Components";
import ComplitedAppointment from "./ComplitedAppointment";
import { ClockIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate, useParams } from "react-router";
import axiosClient from "../AxiosClient";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../Redux/SliceAuthUser";
import { get } from "../Services/LocalStorageService";
import Appointment from "../Components/AppointmentSelection";
import AppointmentSelection from "../Components/AppointmentSelection";
import ReviewComponent from "../Components/ReviewComponent";
import PaymentPage from "../Components/PaymentPage";
import TimeSlots from "../Components/TimeSlots";
import DoctorProfileCard from "../Components/DoctorProfileCard";
import PostAReview from "../Components/PostAReview";

const BookingAppointment = () => {
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [doctorDetails, setDoctorDetails] = useState({});
  const [appointmentFee, setAppointmentFee] = useState(0);
  const [showComplitedAppointment, setShowComplitedAppointment] = useState(false);
  const [filePath, setFilePath] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.authUser);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const location = useLocation()

  const locationState = location.state;

  useEffect(() => {
    if (!locationState) {
      navigate("/search-doctor");
    }
  }, [])
  

  useEffect(() => {

    setLoading(true);

    if (userData.isAuthenticated && get("TOKEN_USER") && userData.user === null) {
      axiosClient
        .get("/user")
        .then((res) => {
          dispatch(addUserData(res.data));
        })
        .catch(() => {
          navigate("/user-login");
        });
    }

    axiosClient
      .get(`/doctor/${id}`)
      .then((res) => {
        console.log('doctorrr data: ', res)
        const doctorData = res.data[0];
        console.log('doctor data API: ', doctorData);
        setDoctorDetails({
          id: doctorData.id,
          name: `Dr. ${doctorData.firstname} ${doctorData.lastname}`,
          specialite: doctorData.specialite,
          clinicFee: doctorData.clinic_fee,
          videoFee: doctorData.video_fee,
          available: doctorData.available,
        });
        setAppointmentFee(doctorData.clinic_fee); // Assuming clinic fee for this example
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dispatch, id, navigate, userData.user, userData.isAuthenticated]);

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedDateFormatted = new Date(selectedDate).toISOString().slice(0, 10);
    const feeToUse = selectedTime === 'video' ? doctorDetails.videoFee : doctorDetails.clinicFee;

    axiosClient
      .post("/take/appointment", {
        user_id: userData.user.id,
        doctor_id: id,
        appointments: [{
          date: selectedDateFormatted,
          time: selectedTime,
          fee: feeToUse
        }],
      })
      .then((res) => {
        setFilePath(res.data.namefile);
        setShowComplitedAppointment(true);
      })
      .catch((err) => console.log(err));
  };

  const handlePayment = (paymentMethod) => {
    navigate("/onlinepayment", {
      state: {
        doctorDetails,
        selectedDate,
        selectedTime,
        feeType:locationState.feeType,
        appointmentFee,
        paymentMethod
      }
    });
  };  
  

  if (!loading) {
    return (
      <>
        <div className="absolute w-[100%] h-[100vh]">
          <div className="relative bg-black bg-opacity-75">
            <Header />
            <DoctorProfileCard
              avatar_doctor={doctorDetails.avatar_doctor}
              firstname={doctorDetails.firstname}
              lastname={doctorDetails.lastname}
              specialite={doctorDetails.specialite}
              clinic_fee={doctorDetails.clinicFee}
              video_fee={doctorDetails.videoFee}
              feeType={locationState?.feeType}
              // available={doctorDetails.available}
              // address_cabinet={doctorDetails.address_cabinet}
            />

            <div className="my-4">
              <TimeSlots
                doctorId={id}
                doctorDetails={doctorDetails}
                feeType={locationState.feeType}
                setSelectedTime={setSelectedTime}
                setSelectedDate={setSelectedDate}
                handleTimeChange={handleTimeChange}
              />
            </div>

            <ReviewComponent doctorId={id}/>

            <Footer colorText="white" />

          </div>
        </div>

        <ComplitedAppointment
          showComplitedAppointment={showComplitedAppointment}
          setShowComplitedAppointment={setShowComplitedAppointment}
          filePath={filePath}
        />

      </>
    )
  } else {
    return (
      <div className="flex h-[100vh] w-full justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }
};

export default BookingAppointment;
