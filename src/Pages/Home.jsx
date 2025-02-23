import React from "react";

import { Footer, Header, Section } from "../Components";

import "../Assets/Css/HomeCss/Home.css";
// import TopBar from "../Components/TopBar";
import TopHealthyArticles from "../Components/TopHealthyArticles";
import CustomerLove from "../Components/CustomerLove";
import FooterTopBar from "../Components/FooterTopBar";
import AppointmentSelection from "../Components/AppointmentSelection";
// import DoctorCard from "./Users/DoctorCard";





export const Home = () => {
  document.title = "DocAppoint";

  return (
    
      <div className="wrapper">
      {/* <TopBar/>  */}
      <Header />
      {/* <DoctorCard/> */}
      <Section />
      {/* <AppointmentSelection/> */}
      <CustomerLove/>
      <TopHealthyArticles/>
      <FooterTopBar/>
      <Footer />
      
      </div>
  );
};

export default Home;
