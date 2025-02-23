import React, { useState, useEffect } from "react";
import axiosClient from "../AxiosClient";
import { useNavigate } from "react-router-dom";
import "../Assets/Css/HomeCss/BannerSearch.css";

const BannerSearch = () => {
  const [specialitiesList, setSpecialitiesList] = useState([]);
  const [dataForm, setDataForm] = useState({
    address_cabinet: "",
    specialite: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch specialties list on component mount
    axiosClient.get("/specialite/list")
      .then((res) => setSpecialitiesList(res.data.specialities))
      .catch((err) => console.error(err));
  }, []);

  const handleChangeData = (ev) => {
    const { name, value } = ev.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmitData = (e) => {
    e.preventDefault();
    navigate("/search-doctor", { state: dataForm });
  };

  return (
    <section className="banner_search">
        <h2 className="search_heading">Find and Book the <br></br>Best Doctors near you</h2>
      <form onSubmit={handleSubmitData} className="search_form">
        <div className="search_input" style={{
          color:"white",
        }}>
          {/* <label htmlFor="Location" className="label_search">
            Location
          </label> */}
          <input
            id="Location"
            type="text"
            name="address_cabinet"
            className="input_search"
            placeholder="Choose Town"
            onChange={handleChangeData}
          />
        </div>

        <div className="search_input">
          {/* <label htmlFor="Specialite" className="label_search">
            Specialty
          </label> */}
          <select
            id="Specialite"
            name="specialite"
            className="input_search"
            onChange={handleChangeData}
          >
            <option value="">Select Specialty</option>
            {specialitiesList.map((specialite, idx) => (
              <option key={idx} value={specialite}>
                {specialite}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn_search">
          Search
        </button>
      </form>
    </section>
  );
};

export default BannerSearch;
