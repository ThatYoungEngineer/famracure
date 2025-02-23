import React, { useState, useEffect } from "react";
import axiosClient from "../AxiosClient";
import { Footer, Header, AlertToRegistre, SearchDoctorCard, Spinner } from "../Components";
import "../Assets/Css/HomeCss/SearchDoctors.css";
import { useSelector } from "react-redux";
import FooterTopBar from "../Components/FooterTopBar";
import FAQSection from '../Components/FAQSection';
import AppointmentFilterPanel from "../Components/AppointmentFilterPanel";
import LoadMoreButton from "../Components/LoadMoreButton";

const SearchDoctors = () => {
  document.title = "Search for a Doctor";

  const AuthUserData = useSelector((state) => state.authUser);
  const [loading, setLoading] = useState(false);
  const [specialitiesList, setSpecialitiesList] = useState([]);
  const [areasList, setAreasList] = useState([]); // For storing areas list
  const [dataForm, setDataForm] = useState({
    address_cabinet: "",
    specialite: "",
    gender: "",
    availability: [],
    fee_range: "",
    page: 1
  });
  const [dataSearch, setDataSearch] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Fetch specialities and areas on component mount
    axiosClient.get("/specialite/list")
      .then((res) => setSpecialitiesList(res.data.specialities))
      .catch((err) => console.error(err));

    axiosClient.get("/areas/list") // Assuming this endpoint exists
      .then((res) => setAreasList(res.data.areas))
      .catch((err) => console.error(err));

    // Fetch default doctors when page loads
    fetchDoctors(dataForm);
  }, []);

  const fetchDoctors = (formData = {}) => {
    setLoading(true);
    axiosClient.post("/search/doctors", formData)
      .then((res) => {
        setHasMore(res.data.DataSearch.next_page_url !== null);
        if (formData.page === 1) {
          setDataSearch(res.data.DataSearch.data); // Update with new search results
        } else {
          setDataSearch(prevData => [...prevData, ...res.data.DataSearch.data]); // Append more results
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleChangeData = (ev) => {
  const { name, value, type, checked } = ev.target;

  let updatedForm = { ...dataForm };  // Make a copy of the current state
  if (type === "checkbox") {
    // If it's a checkbox, update the availability array
    const updatedAvailability = checked
      ? [...updatedForm.availability, value]
      : updatedForm.availability.filter(val => val !== value);

    updatedForm.availability = updatedAvailability;
  } else {
    updatedForm[name] = value; // For other types of inputs, update directly
  }
  
  setDataForm(updatedForm); // Update state

  // Trigger search immediately after the change
  fetchDoctors({ ...updatedForm, page: 1 });
};


  const handleSubmitData = (e) => {
    e.preventDefault();
    fetchDoctors(dataForm); // Fetch doctors based on search form input
  };

  const handleLoadMore = () => {
    const newPage = dataForm.page + 1;
    setDataForm((prevDataForm) => {
      const updatedData = { ...prevDataForm, page: newPage };
      fetchDoctors(updatedData);
      return updatedData;
    });
  };

  
  const [showAlertToRegistre, setSowAlertToRegistre] = useState(AuthUserData.showAlertToAuth);

  return (
    <>
      <Header />
      <section>
        <div className="_img_cover">
          <div className="search_bar">
            <form onSubmit={handleSubmitData}>
              <div className="search_input">
                <label htmlFor="Location" className="label_search">
                  Location
                  <i className="fas fa-map-marker-alt"></i>
                </label>
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
                <label htmlFor="Specialite" className="label_search">
                  Specialty
                  <i className="fas fa-stethoscope"></i>
                </label>
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
              <button className="btn_search btn_bg_primary">Search</button>
            </form>
          </div>
        </div>
      </section>

      <main className="_container mt-4 mb-4">
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Left Column - Appointment Filter Panel */}
          <div className="lg:col-span-1">
            <AppointmentFilterPanel
              handleChangeData={handleChangeData}
              specialitiesList={specialitiesList}
              areasList={areasList}
            />
          </div>

          {/* Right Column - Doctor Cards */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="w-full flex items-center justify-center mb-10">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                {dataSearch.length ? (
                  dataSearch.map((info) => (
                    <SearchDoctorCard
                      key={info.id}
                      id={info.id}
                      firstname={info.firstname}
                      lastname={info.lastname}
                      qualifications={info.qualifications}
                      experience_years={info.experience_years}
                      satisfaction_percentage={info.satisfaction_percentage}
                      day_debut_work={info.day_debut_work}
                      day_fin_work={info.day_fin_work}
                      time_debut_work={info.time_debut_work}
                      time_fin_work={info.time_fin_work}
                      specialite={info.specialite}
                      available={info.available}
                      avatar_doctor={info.avatar_doctor}
                      
                      address_cabinet={info.address_cabinet}
                      video_fee={info.video_fee}
                      clinic_fee={info.clinic_fee}
                      
                    />
                  ))
                ) : (
                  <p>No doctors found</p>
                )}
              </div>
            )}

            {/* Load More Button */}
            {!loading && hasMore && dataSearch.length > 0 && (
              <LoadMoreButton onClick={handleLoadMore} />
            )}
          </div>
        </div>
      </main>
      
      <FAQSection />
      <FooterTopBar />
      <Footer />
      <AlertToRegistre
        showAlertToRegistre={showAlertToRegistre}
        setSowAlertToRegistre={setSowAlertToRegistre}
      />
    </>
  );
};

export default SearchDoctors;
