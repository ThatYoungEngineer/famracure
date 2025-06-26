import React, { useEffect, useState } from "react";
import GetAuthDoctor from "../../../hooks/GetAuthDoctor";
import { useSelector } from "react-redux";
import axiosClient from "../../../AxiosClient";
import AuthButton from "../../AuthButton";
import { Button } from "@mui/material";
import { ChevronDownIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { Alert } from "flowbite-react";

const PersonalInformation = () => {
  const doctorData = useSelector((state) => state.AuthDoctor);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("")

  const [DataForm, setDataForm] = useState({})
  const [experienceList, setExperienceList] = useState([
    {
      institute: '',
      city: '',
      country: '',
      start_date: '',
      end_date: '',
      experience_years: 0,
      detail: '',
      degree_certificates: [],
    }
  ])
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [showExpFields, setShowExpFields] = useState(false)
  const [loadingForToggle, setLoadingForToggle] = useState(false)
  const [responseForToggle, setResponseForToggle] = useState(null)

  GetAuthDoctor()

  useEffect(() => {
    if (doctorData.doctor !== null) {
      setDataForm({
        id: doctorData.doctor.id,
        firstname: doctorData.doctor.firstname || "",
        lastname: doctorData.doctor.lastname || "",
        cin: doctorData.doctor.cin || "",
        phoneNumber: doctorData.doctor.phoneNumber || "",
        email: doctorData.doctor.email || "",
        gender: doctorData.doctor.gender || "",
        date_of_birth: doctorData.doctor.date_of_birth || "",
        Matricule: doctorData.doctor.matricule || "",
        specialite: doctorData.doctor.specialite || "",
        nom_cabinet: doctorData.doctor.nom_cabinet || "",
        address_cabinet: doctorData.doctor.address_cabinet || "",
        available: doctorData.doctor.available == "1" ? true : false,
        verified: doctorData.doctor.verified == "1" ? true : false,
        is_approved: doctorData.doctor.is_approved == "1" ? true : false,
        about: doctorData.doctor.about || "",
        experience_years: doctorData.doctor.experience_years || "",
        experience: doctorData.doctor.experience || [],
      })
      if (doctorData?.doctor?.experience?.length > 0) {
        setExperienceList(doctorData.doctor.experience);
      }
      setPreview(doctorData.doctor.avatar_doctor || process.env.PUBLIC_URL + "/img/doc-image.jpg");
    }
  }, [doctorData]);

  // Cleanup function for the object URL when component unmounts
  useEffect(() => {
    return () => {
      // Check if preview is a blob URL (created by URL.createObjectURL)
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const HandelChangeCheckbox = (e) => {
    setLoadingForToggle(true);
    setResponseForToggle("");
    axiosClient
      .post("/doctors/availability", {
        available: e.target.checked
      })
      .then((res) => {
        const success = res?.data?.updated === "success";
        if (success) {
          setDataForm(prev => ({
            ...prev,
            available: e.target.checked
          }));
          setResponseForToggle("Doctor availability updated successfully!");
        }
        setLoadingForToggle(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingForToggle(false);
      })
  };

  const HandelChange = (e, index) => {
    const { name, value } = e.target;
    setDataForm({ ...DataForm, [name]: value });
  };

  const addExperience = () => {
    setExperienceList([...experienceList, { institute: "", start_date: "", end_date: "", degree_certificates: [] }]);
  };

  const handleChangeInExperience = (e, index) => {
    const { name, value, files } = e.target;

    setExperienceList((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            [name]: name === "degree_certificates"
              ? [...(item[name] ? [...item[name]] : []), ...Array.from(files)]
              : value
          }
          : item
      )
    );
  };

  const removeExperience = (index) => {
    const newExperienceList = experienceList.filter((_, i) => i !== index);
    setExperienceList(newExperienceList);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  const HandelSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", DataForm.id);
    formData.append("firstname", DataForm.firstname);
    formData.append("lastname", DataForm.lastname);
    formData.append("cin", DataForm.cin);
    formData.append("phoneNumber", DataForm.phoneNumber);
    formData.append("date_of_birth", DataForm.date_of_birth);
    formData.append("email", DataForm.email);
    formData.append("Matricule", DataForm.Matricule);
    formData.append("specialite", DataForm.specialite);
    formData.append("nom_cabinet", DataForm.nom_cabinet);
    formData.append("address_cabinet", DataForm.address_cabinet);
    formData.append("available", DataForm.available ? 1 : 0);
    formData.append("about", DataForm.about);
    formData.append("cin", DataForm.cin);

    if (selectedFile) {
      formData.append("avatar_doctor", selectedFile);
    }

    experienceList.forEach((experience, index) => {
      formData.append(`institute[${index}]`, experience.institute);
      formData.append(`city[${index}]`, experience.city);
      formData.append(`country[${index}]`, experience.country);
      formData.append(`experience_start_date[${index}]`, experience.start_date);
      formData.append(`experience_end_date[${index}]`, experience.end_date);
      formData.append(`experience_detail[${index}]`, experience.detail);
      if (experience.degree_certificates) {
        experience.degree_certificates.forEach((file, fileIndex) => {
          if (typeof file === "string") {
            formData.append(`existing_degree_certificates[]`, file);
          } else {
            formData.append(`degree_certificates[${fileIndex}]`, file);
          }
        });
      }
    })
    setSuccessMessage("");
    axiosClient
      .post("/doctor/update/info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const success = res?.data?.updated;
        setSuccessMessage(success ? "Doctor information updated successfully" : "");
        setExperienceList(res.data.doctor.experience)
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
  }

  const handleApprovalClick = () => {
    axiosClient
      .post("/doctor/request-approval")
      .then((res) => {
        const success = res?.data?.message;
        setSuccessMessage(success ? "Doctor approved successfully" : "Your request for approval has been sent");
      })
      .catch((err) => {
        setSuccessMessage(err?.response?.data?.message);
      })
  }

  return (
    <section className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 xl:gap-10 justify-between p-2 sm:p-4">
      {/* Profile Picture Section */}
      <div className="w-full lg:w-[40%] xl:w-[35%] 2xl:w-[30%]">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div className="flex flex-col items-center gap-6">
            <div className="relative group mx-auto">
              <img 
                className="rounded-full object-cover w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 border-4 border-blue-100 dark:border-blue-900 shadow-lg transition-transform duration-300 group-hover:scale-105" 
                src={preview || process.env.PUBLIC_URL + "/img/doc-image.jpg"} 
                alt="Profile" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = process.env.PUBLIC_URL + "/img/doc-image.jpg";
                }}
              />
            </div>
            <div className="w-full text-center mt-4">
              <h3 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Profile picture
              </h3>
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                JPG, GIF, or PNG. Max size: 800KB
              </div>

              <input
                id="fileInputButton"
                type="file"
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileInputButton"
                className="inline-block px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 mx-auto"
              >
                Choose Image
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-3 sm:p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg sm:text-xl font-semibold dark:text-white">
          General Information
        </h3>
        <form onSubmit={HandelSubmit}>
          <div className="flex items-center mb-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                disabled={loadingForToggle}
                checked={DataForm.available}
                name="available"
                onChange={HandelChangeCheckbox}
                className="sr-only peer"
              />
              <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-900">
                Doctor Is Present
              </span>
            </label>
          </div>
          {responseForToggle && (
            <div className="mb-2 text-green-500 text-xs sm:text-sm">
              {responseForToggle}
            </div>
          )}

          <div className="grid grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Bonnie"
                required
                value={DataForm.firstname}
                onChange={HandelChange}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="tt"
                required
                value={DataForm.lastname}
                onChange={HandelChange}
              />
            </div>
          </div>

          <div className="grid mt-3 grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Matricule
              </label>
              <input
                type="text"
                name="Matricule"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Matricule"
                required
                value={DataForm.Matricule}
                onChange={HandelChange}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Specialite
              </label>
              <input
                type="text"
                name="specialite"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Specialization"
                required
                value={DataForm.specialite}
                onChange={HandelChange}
              />
            </div>
          </div>

          <div className="grid mt-3 grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="phoneNumber"
                required
                value={DataForm.phoneNumber}
                onChange={HandelChange}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="tt"
                required
                disabled
                readOnly
                value={DataForm.email}
                onChange={HandelChange}
              />
            </div>
          </div>

          <div className="grid mt-3 grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Date of birth"
                required
                value={DataForm.date_of_birth}
                onChange={HandelChange}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Gender
              </label>
              <select
                name="gender"
                value={DataForm.gender}
                onChange={HandelChange}
                className={`bg-gray-50 border text-xs sm:text-sm rounded-lg block w-full p-2 sm:p-2.5 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-gray-300 text-gray-900}`}
              >
                <option value="#" selected disabled>--Select Gender--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="transgender">Transgender</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <div className="col-span-6 sm:col-full mt-3 mb-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                About
              </label>
              <textarea
                rows="4"
                name="about"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder=" about You..."
                value={DataForm.about}
                onChange={HandelChange}
              ></textarea>
            </div>
          </div>

          <div className="grid mt-3 grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Name of clinic
              </label>
              <input
                type="text"
                name="nom_cabinet"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="clinic name"
                required
                value={DataForm.nom_cabinet}
                onChange={HandelChange}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                Address of clinic
              </label>
              <input
                type="text"
                name="address_cabinet"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="clinic address"
                required
                value={DataForm.address_cabinet}
                onChange={HandelChange}
              />
            </div>
          </div>

          <div className="col-span-6 sm:col-span-3 mt-3">
            <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              CIN
            </label>
            <input
              type="text"
              name="cin"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="cin"
              required
              value={DataForm.cin}
              onChange={HandelChange}
            />
          </div>

          <div className="w-full flex gap-2 items-center justify-center mt-4 sm:mt-5">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">Experience Fields</h1>
            <span className="flex-1 border-t border-black" />
            <button type="button" onClick={() => setShowExpFields(prev => !prev)}>
              <ChevronDownIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${showExpFields ? 'rotate-180' : 'rotate-0'}`} />
            </button>
          </div>

          {showExpFields && (
            <>
              {experienceList?.map((experience, index) => (
                <div key={index} className="border p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
                  <div className="w-full sm:w-44 mt-3 sm:mt-4">
                    <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      readOnly
                      disabled
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg block w-full p-2 sm:p-2.5 disabled:opacity-80"
                      value={experience.experience_years}
                    />
                  </div>
                  <h1 className="text-lg sm:text-xl font-semibold mt-3 sm:mt-4">Institute Details</h1>
                  <div className="grid mt-2 grid-cols-6 gap-x-3 sm:gap-x-4 md:gap-x-5 lg:gap-x-6 gap-y-2 sm:gap-y-3">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        Institute Name
                      </label>
                      <input
                        type="text"
                        name="institute"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg block w-full p-2 sm:p-2.5"
                        value={experience.institute}
                        onChange={(e) => handleChangeInExperience(e, index)}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        Institute City
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg block w-full p-2 sm:p-2.5"
                        value={experience.city}
                        onChange={(e) => handleChangeInExperience(e, index)}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        Institute Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg block w-full p-2 sm:p-2.5"
                        value={experience.country}
                        onChange={(e) => handleChangeInExperience(e, index)}
                      />
                    </div>
                  </div>

                  <div className="grid mt-2 grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        Experience Start Date
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg block w-full p-2 sm:p-2.5"
                        value={experience.start_date}
                        onChange={(e) => handleChangeInExperience(e, index)}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        Experience End Date
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg block w-full p-2 sm:p-2.5"
                        value={experience.end_date}
                        onChange={(e) => handleChangeInExperience(e, index)}
                      />
                    </div>
                  </div>

                  <div className="grid mt-2 grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    <div className="col-span-6">
                      <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        Experience Detail
                      </label>
                      <textarea
                        rows="3"
                        name="detail"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter your experience details"
                        onChange={(e) => handleChangeInExperience(e, index)}
                        value={experience.detail}
                      ></textarea>
                    </div>

                    <div className="col-span-6 flex flex-col gap-1 sm:gap-2">
                      <label className="block mb-1 sm:mb-2 text-sm sm:text-lg font-medium text-gray-900 dark:text-white">
                        Experience Certificates
                        <p className="text-xs sm:text-sm font-light">Upload Education/Experience/Degree (documents)</p>
                      </label>
                      <input
                        type="file"
                        name="degree_certificates"
                        accept="image/png, image/jpeg, image/gif"
                        multiple
                        onChange={e => handleChangeInExperience(e, index)}
                        className="text-xs sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 flex flex-col gap-1 sm:gap-2">
                      {experience?.degree_certificates?.length > 0 &&
                        experience.degree_certificates.map((certificate, certificateIndex) => (
                          <div key={certificateIndex} className="w-full flex-1">
                            {typeof certificate === "string" ? (
                              <a href={certificate} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-blue-500 underline">
                                {certificate}
                              </a>
                            ) : (
                              <span className="flex-1 text-xs sm:text-sm text-gray-700">{certificate.name}</span>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="mt-2 sm:mt-3 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm"
                    >
                      Remove Experience
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addExperience}
                className="bg-yellow-400 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mt-3 sm:mt-4 text-xs sm:text-sm"
              >
                Add More Experiences
              </button>
            </>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-5 w-full mt-6 sm:mt-8">
            <div className="w-full sm:w-[30%] md:w-[25%] lg:w-[20%]">
              <AuthButton 
                Text="Save all" 
                Loading={loading} 
                isDisabled={DataForm.verified || loadingForToggle} 
                className="w-full text-xs sm:text-sm"
              />
            </div>
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={handleApprovalClick}
                disabled={loadingForToggle}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Request for Approval
              </Button>
            </div>
          </div>

          {successMessage && (
            <p className="mt-2 sm:mt-3 text-green-500 text-xs sm:text-sm">
              {successMessage}
            </p>
          )}
        </form>

        <div className="mt-6 sm:mt-8">
          <Alert color="warning" withBorderAccent icon={InformationCircleIcon}>
            <span className="text-xs sm:text-sm">
              <span className="font-medium">Note!</span> Filled information after admin approval cannot be changed.
            </span>
          </Alert>
        </div>
      </div>
    </section>
  );
};

export default PersonalInformation;
