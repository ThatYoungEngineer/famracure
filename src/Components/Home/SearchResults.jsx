import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../AxiosClient";
import { Spinner, SearchDoctorCard } from "../Components";

const SearchResults = () => {
  const location = useLocation();
  const { address_cabinet, specialite } = location.state || {};
  const [dataSearch, setDataSearch] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address_cabinet || specialite) {
      setLoading(true);
      axiosClient.post("/search/doctors", { address_cabinet, specialite })
        .then((res) => {
          setDataSearch(res.data.DataSearch || []);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
        });
    }
  }, [address_cabinet, specialite]);

  return (
    <main className="_container mt-4 mb-4">
      {loading && (
        <div className="w-full flex items-center justify-center mb-10">
          <Spinner />
        </div>
      )}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
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
  />
  
      
    ))
  ) : (
    <p>No doctors found</p>
  )}
  
</div>

    </main>
  );
};

export default SearchResults;
