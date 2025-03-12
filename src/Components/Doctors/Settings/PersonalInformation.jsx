import React, { useEffect, useState } from "react";
import GetAuthDoctor from "../../../hooks/GetAuthDoctor";
import { useSelector } from "react-redux";
import axiosClient from "../../../AxiosClient";
import AuthButton from "../../AuthButton";
const PersonalInformation = () => {
  const doctorData = useSelector((state) => state.AuthDoctor);  
  
  const [loading, setLoading] = useState(false);
  const [experienceList, setExperienceList] = useState([
    { experience_years: "", experience_institute: "", experience_start_date: "", experience_end_date: "", experience_certificates: [], experience_detail: "" },
  ]);
  const [certificates, setCertificates] = useState([])
  const [successMessage, setSuccessMessage] = useState("")

  const [DataForm, setDataForm] = useState({
    id: "",
    firstname: "",
    lastname: "",
    cin: "",
    phoneNumber: "",
    email: "",
    Matricule: "",
    specialite: "",
    nom_cabinet: "",
    address_cabinet: "",
    available: "0",
    about: "",
  });

  GetAuthDoctor();

  useEffect(() => {
    if (doctorData.doctor !== null) {
      setDataForm({
        id: doctorData.doctor.id,
        firstname: doctorData.doctor.firstname || "",
        lastname: doctorData.doctor.lastname || "",
        cin: doctorData.doctor.cin || "",
        phoneNumber: doctorData.doctor.phoneNumber || "",
        email: doctorData.doctor.email || "",
        Matricule: doctorData.doctor.matricule || "",
        specialite: doctorData.doctor.specialite || "",
        nom_cabinet: doctorData.doctor.nom_cabinet || "",
        address_cabinet: doctorData.doctor.address_cabinet || "",
        available: doctorData.doctor.available==="1" ? true :false ,
        about: doctorData.doctor.about || "",
        experience_years: doctorData.doctor.experience_years || "",
        experience_institute: doctorData.doctor.experience_institute || "",
        experience_start_date: doctorData.doctor.experience_start_date || "",
        experience_end_date: doctorData.doctor.experience_end_date || "",
        experience_detail: doctorData.doctor.experience_detail || "",

      });
    }
  }, [doctorData ]);

  const HandelChangeCheckbox = (e) => {
    setDataForm({ ...DataForm, available: e.target.checked });
  };

  const HandelChange = (e, index) => {
    const { name, value } = e.target;
    setDataForm({ ...DataForm, [name]: value });
    // const newExperienceList = [...experienceList];
    // console.log('newExperienceList', newExperienceList)
    // newExperienceList[index][name] = value;
    // setExperienceList(newExperienceList);
  };

  const addExperience = () => {
    setExperienceList([...experienceList, { years: "", institute: "", start_date: "", end_date: "" }]);
  };

  const handleChangeInExperience = (e, index) => {
    const { name, value } = e.target;

    setExperienceList((prev) => {
      const newState = [...prev];

      newState[index][name] = value;

      return newState;
    })
  }

  const removeExperience = (index) => {
    const newExperienceList = experienceList.filter((_, i) => i !== index);
    setExperienceList(newExperienceList);
  };


  const HandelSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("id", DataForm.id);
    formData.append("firstname", DataForm.firstname);
    formData.append("lastname", DataForm.lastname);
    formData.append("cin", DataForm.cin);
    formData.append("phoneNumber", DataForm.phoneNumber);
    formData.append("email", DataForm.email);
    formData.append("Matricule", DataForm.Matricule);
    formData.append("specialite", DataForm.specialite);
    formData.append("nom_cabinet", DataForm.nom_cabinet);
    formData.append("address_cabinet", DataForm.address_cabinet);
    formData.append("available", DataForm.available ? "1" : "0");
    formData.append("about", DataForm.about);
    experienceList.forEach((experience, index) => {
      formData.append(`experience_years[${index}]`, experience.experience_years);
      formData.append(`experience_institute[${index}]`, experience.experience_institute);
      formData.append(`experience_start_date[${index}]`, experience.experience_start_date);
      formData.append(`experience_end_date[${index}]`, experience.experience_end_date);
      formData.append(`experience_detail[${index}]`, experience.experience_detail);
      experience.experience_certificates.forEach((certificate, i) => {
        formData.append(`experience_certificates[${index}][${i}]`, certificate);
      });
    })


    console.log(DataForm);
    setSuccessMessage("");
    axiosClient
      .post("/doctor/update/info", formData)
      .then((res) => {
        console.log(res);
        const success = res?.data?.updated 
        setSuccessMessage(success ? "Doctor information updated successfully" : "");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  console.log('experience list', experienceList)

  return (
    <>
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold dark:text-white">
          General inhtmlFormation
        </h3>

        <form onSubmit={HandelSubmit}>
          <label className="relative inline-flex items-center mb-4 cursor-pointer">
            <input
              type="checkbox"
              // value={DataForm.available}
              checked={DataForm.available}
              name="available"
              onChange={HandelChangeCheckbox}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 ">
              Doctor Is Present
            </span>
          </label>

          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                id="first-name"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Bonnie"
                required
                value={DataForm.firstname}
                onChange={HandelChange}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="lastname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                lastname
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="tt"
                required
                value={DataForm.lastname}
                onChange={HandelChange}
              />
            </div>
          </div>

          <div className="grid mt-3 grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="Matricule"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Matricule
              </label>
              <input
                type="text"
                name="Matricule"
                id="Matricule"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Matricule"
                required
                value={DataForm.Matricule}
                onChange={HandelChange}
              />
            </div>
            <div className="col-span-6  sm:col-span-3">
              <label
                htmlFor="specialite"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                specialite
              </label>
              <input
                type="text"
                name="specialite"
                id="specialite"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="tt"
                required
                value={DataForm.specialite}
                onChange={HandelChange}
              />
            </div>
          </div>

          <div className="grid mt-3 grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                phoneNumber
              </label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="phoneNumber"
                required
                value={DataForm.phoneNumber}
                onChange={HandelChange}
              />
            </div>
            <div className="col-span-6  sm:col-span-3">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="tt"
                required
                value={DataForm.email}
                onChange={HandelChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-full mt-4 mb-4">
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {" "}
                about{" "}
              </label>
              <textarea
                id="chat"
                rows="5"
                name="about"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder=" about You..."
                value={DataForm.about}
                onChange={HandelChange}
              ></textarea>
            </div>
          </div>

          <div className="grid mt-3 grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="nom_cabinet"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                nom cabinet
              </label>
              <input
                type="text"
                name="nom_cabinet"
                id="nom_cabinet"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="nom_cabinet"
                required
                value={DataForm.nom_cabinet}
                onChange={HandelChange}
              />
            </div>
            <div className="col-span-6  sm:col-span-3">
              <label
                htmlFor="address_cabinet"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                address cabinet
              </label>
              <input
                type="text"
                name="address_cabinet"
                id="address_cabinet"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="tt"
                required
                value={DataForm.address_cabinet}
                onChange={HandelChange}
              />
            </div>
          </div>

          
          {experienceList.map((experience, index) => (
        <div key={index} className="border p-4 rounded-lg mt-10">
          <div className="grid mt-3 grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Experience Years
              </label>
              <input
                type="number"
                name="experience_years"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="Enter experience years"
                value={experience.experience_years}
                onChange={(e) => handleChangeInExperience(e, index)}
                
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Experience Institute
              </label>
              <input
                type="text"
                name="experience_institute"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="Enter institute name"
                value={experience.experience_institute}
                onChange={(e) => handleChangeInExperience(e, index)}
                
              />
            </div>
          </div>

          <div className="grid mt-3 grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Experience Start Date
              </label>
              <input
                type="date"
                name="experience_start_date"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                value={experience.experience_start_date}
                onChange={(e) => handleChangeInExperience(e, index)}
                
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Experience End Date
              </label>
              <input
                type="date"
                name="experience_end_date"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                value={experience.experience_end_date}
                onChange={(e) => handleChangeInExperience(e, index)}
                
              />
            </div>
            <div className="col-span-6 flex flex-col gap-2">
              <label
                htmlFor="experience_certificates"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Experience Certificates
              </label>
              <input type="file" multiple onChange={e => handleChangeInExperience(e, index)} />
            </div>
             <div className="col-span-6">
              <label
                htmlFor="experience_detail"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Experience Detail
              </label>
              <textarea
                id="experience_detail"
                rows="5"
                name="experience_detail"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter your experience details"
                onChange={(e) => handleChangeInExperience(e, index)}                
                value={DataForm.experience_detail}
              ></textarea>
            </div>
          </div>

          {index > 0 && (
            <button
              onClick={() => removeExperience(index)}
              className="mt-3 bg-red-500 text-white px-3 py-2 rounded-lg"
            >
              Remove Experience
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addExperience}
        className="bg-yellow-400 text-white px-4 py-2 rounded-lg mt-4"
      >
        Add More Experiences
      </button>
          <div className="grid mt-3 grid-cols-6 gap-6  w-[100%]">
            <div className="col-span-6 sm:col-full  w-[20%]">
              <AuthButton Text="Save all" Loading={loading} isDisabled={doctorData.doctor.verified} />
            </div>
          </div>
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </form>
      </div>
    </>
  );
};

export default PersonalInformation;
