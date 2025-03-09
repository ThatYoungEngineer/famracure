import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient from "../AxiosClient";
import { addUserData } from "../Redux/SliceAuthUser";
import { get, remove } from "../Services/LocalStorageService";

const VerificationEmailGuard = ({ children }) => {
  const UserData = useSelector((state) => state.authUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch user data if authenticated but user data is not available
    if (UserData.isAuthenticated && get("TOKEN_USER") && !UserData.user) {
      axiosClient
        .get("/user")
        .then((res) => {
          dispatch(addUserData(res.data)); // Add user data to Redux store
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          remove("TOKEN_USER"); // Remove invalid token
          navigate("/user-login"); // Redirect to login page
        })
        .finally(() => {
          setIsLoading(false); // Set loading to false after request completes
        });
    } else {
      setIsLoading(false); // Set loading to false if no fetch is needed
    }
  }, [dispatch, navigate, UserData.isAuthenticated, UserData.user]);

  // Show loading state while fetching data
  if (isLoading) {
    return <div>Loading...</div>; // Replace with a proper loading spinner
  }

  // If user is not authenticated, redirect to login
  if (!UserData.isAuthenticated || !get("TOKEN_USER")) {
    navigate("/user-login");
    return null;
  }

  // If user data is available
  if (UserData.user && !UserData.user.email_verified_at ) {
    return children;
  } else {
    navigate("/user/profile");
  }
  // Default return (e.g., if no conditions are met)
  return null;
};

export default VerificationEmailGuard;