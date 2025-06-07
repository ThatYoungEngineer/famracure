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
  const [errors, setErrors] = useState({
    address_cabinet: "",
    specialite: "",
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch specialties list on component mount
    axiosClient.get("/specialite/list")
      .then((res) => setSpecialitiesList(res.data.specialities))
      .catch((err) => console.error(err));

    // Add event listener for window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      address_cabinet: "",
      specialite: "",
    };

    if (!dataForm.address_cabinet.trim()) {
      newErrors.address_cabinet = "Location is required";
      valid = false;
    }

    if (!dataForm.specialite) {
      newErrors.specialite = "Specialty is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChangeData = (ev) => {
    const { name, value } = ev.target;
    setDataForm({ ...dataForm, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmitData = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate("/search-doctor", { state: dataForm });
    }
  };

  return (
    <section className="banner_search">
      <h2 className="search_heading">Find and Book the <br></br>Best Doctors near you</h2>
      <form onSubmit={handleSubmitData} className="search_form">
        <div className="search_input">
          {/* <label htmlFor="Location" className="label_search">
            Location
          </label> */}
          <input
            id="Location"
            type="text"
            name="address_cabinet"
            className={`input_search ${errors.address_cabinet ? 'input-error' : ''}`}
            placeholder="Choose Town"
            onChange={handleChangeData}
            value={dataForm.address_cabinet}
          />
          {errors.address_cabinet && (
            <div className="error-message">
              {errors.address_cabinet}
            </div>
          )}
        </div>

        <div className="search_input">
          {/* <label htmlFor="Specialite" className="label_search">
            Specialty
          </label> */}
          <select
            id="Specialite"
            name="specialite"
            className={`input_search ${errors.specialite ? 'input-error' : ''}`}
            onChange={handleChangeData}
            value={dataForm.specialite}
          >
            <option value="">Select Specialty</option>
            {specialitiesList.map((specialite, idx) => (
              <option key={idx} value={specialite}>
                {specialite}
              </option>
            ))}
          </select>
          {errors.specialite && (
            <div className="error-message">
              {errors.specialite}
            </div>
          )}
        </div>

        <button type="submit" className="btn_search">
          Search
        </button>
      </form>
    </section>
  );
};

export default BannerSearch;
