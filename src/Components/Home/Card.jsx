import React from "react";
import "../../Assets/Css/HomeCss/Card.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Card = ({ id, img, name, specialite }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="card_body" key={id}>
        <div>
          <img
            src={img !== null ? img : "img/doc-listing.jpg"}
            alt=""
            style={{ display: "initial" }}
          />
        </div>
        <h2 style={{ marginTop: "10px" }}
>{name}</h2>
        <p>{specialite}</p>
        <div className="card_btn">
          <button className="btn_card mr_ri btn_bg_primary ">
            <Link to={"/bookingappointment/" + id}>{t("Card.Reserve")}</Link>
          </button>
          <button className="btn_card mr_lf btn_border_primary">
           <Link to={`/doctor/View_Profile/${id}`}>{t("Card.View_Profile")}</Link>

          
          </button>
        </div>
      </div>
   
    </>
  );
};

export default Card;
