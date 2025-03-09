import { useEffect, useState } from "react";
import axiosClient from "../AxiosClient";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addDoctorData } from "../Redux/SliceAuthDoctor";
import { get, remove } from "../Services/LocalStorageService";

const DoctorEmailVerification = ({ children }) => {
  const AuthDoctorData = useSelector((state) => state.AuthDoctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch doctor data if authenticated but doctor data is not available
    if (AuthDoctorData.isAuthenticated && get("TOKEN_DOCTOR") && !AuthDoctorData.doctor) {
      axiosClient
        .get("/doctor")
        .then((res) => {
          dispatch(addDoctorData(res.data)); // Add doctor data to Redux store
        })
        .catch((err) => {
          console.error("Error fetching doctor data:", err);
          remove("TOKEN_DOCTOR"); // Remove invalid token
          navigate("/doctor/login"); // Redirect to login page
        })
        .finally(() => {
          setIsLoading(false); // Set loading to false after request completes
        });
    } else {
      setIsLoading(false); // Set loading to false if no fetch is needed
    }
  }, [dispatch, navigate, AuthDoctorData.isAuthenticated]);

  // Show loading state while fetching data
  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper loading spinner
  }

  // If user is not authenticated, redirect to login
  if (!AuthDoctorData.isAuthenticated || !get("TOKEN_DOCTOR")) {
    navigate("/doctor/login");
    return null;
  }

  // If doctor data is available
  if (AuthDoctorData.doctor) {
    // Redirect to dashboard if email is verified
    if (AuthDoctorData.doctor.email_verified_at) {
      navigate("/doctor/dashboard");
      return null;
    } else {
      // Render children (e.g., email verification page) if email is not verified
      return children;
    }
  }

  // Default return (e.g., if no conditions are met)
  return children;
};

export default DoctorEmailVerification;