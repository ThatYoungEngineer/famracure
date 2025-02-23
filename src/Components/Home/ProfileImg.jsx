import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProfileImg = () => {
  const adminData = useSelector((state) => state.AuthAdmin);
  const doctorData = useSelector((state) => state.AuthDoctor);
  const userData = useSelector((state) => state.authUser);
  const { t } = useTranslation();

  // Define the common image properties
  const imgProps = {
    className: "w-[46px] h-[45px] p-1 rounded-full ring-2 ring-gray-300",
    src: '/img/dp.png',
    alt: "Bordered avatar",
  };

  const getLink = () => {
    if ((adminData.isAuthenticated && adminData.adminToken) || adminData.admin) {
      return "/admin/dashboard";
    } else if ((doctorData.isAuthenticated && doctorData.doctorToken) || doctorData.doctor) {
      return "/doctor/dashboard";
    } else if ((userData.isAuthenticated && userData.userToken) || userData.user) {
      return "/user/profile";
    }
    return null;
  };

  const link = getLink();

  if (link) {
    return <Link to={link} >
      <img {...imgProps} />
    </Link>
  }
}

export default ProfileImg;
