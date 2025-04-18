import React, { useEffect, useState } from "react";
import GetAuthDoctor from "../../../hooks/GetAuthDoctor";
import { useSelector } from "react-redux";
import axiosClient from "../../../AxiosClient";
import AuthButton from "../../AuthButton";
import { Button } from "@mui/material";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const PersonalInformation = () => {
  const doctorData = useSelector((state) => state.AuthDoctor);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("")

  const [DataForm, setDataForm] = useState({})
  const [experienceList, setExperienceList] = useState([
    {
      institute: '',
      start_date: '',
      end_date: '',
      detail: '',
      degree_certificates: [],
    }
  ])
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null); // Default profile picture

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
        setExperienceList(doctorData.doctor.experience); // Ensure it's updated
      }
      setPreview(doctorData.doctor.avatar_doctor || "/img/Rectangle 4.jpg"); // Default if no avatar
    }
  }, [doctorData]);

  console.log('avatar_doctor: ', doctorData.doctor.avatar_doctor)

  const HandelChangeCheckbox = (e) => {
    setLoadingForToggle(true);
    setResponseForToggle("");
    axiosClient
      .post("/doctors/availability", {
        available: e.target.checked
      })
      .then((res) => {
        console.log('availability res : ', res);
        const success = res?.data?.updated === "success";
        if (success) {
          setDataForm(prev => ({
            ...prev,
            available: !prev.available
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
              ? [...(item[name] ? [...item[name]] : []), ...Array.from(files)] // Prevent mutation
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
      setPreview(URL.createObjectURL(file)); // Show image preview
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
    formData.append("email", DataForm.email);
    formData.append("Matricule", DataForm.Matricule);
    formData.append("specialite", DataForm.specialite);
    formData.append("nom_cabinet", DataForm.nom_cabinet);
    formData.append("address_cabinet", DataForm.address_cabinet);
    // formData.append("available", DataForm.available ? 1 : 0);
    formData.append("about", DataForm.about);
    formData.append("cin", DataForm.cin);

    if (selectedFile) {
      formData.append("avatar_doctor", selectedFile); // Fix: Send a file, not a URL
    }

    experienceList.forEach((experience, index) => {
      console.log('experience.degree_certificates: ', experience.degree_certificates)

      formData.append(`institute[${index}]`, experience.institute);
      formData.append(`experience_start_date[${index}]`, experience.start_date);
      formData.append(`experience_end_date[${index}]`, experience.end_date);
      formData.append(`experience_detail[${index}]`, experience.detail);
      if (experience.degree_certificates) {
        experience.degree_certificates.forEach((file, fileIndex) => {
          if (typeof file === "string") {
            // If it's a URL, send it separately (e.g., as JSON or an array field)
            formData.append(`existing_degree_certificates[]`, file);
          } else {
            // If it's a new file (File object), add it to FormData
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
        console.log('updated res : ', res);
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
        console.log(res);
        const success = res?.data?.message;
        setSuccessMessage(success ? "Doctor approved successfully" : "Your request for approval has been sent");
      })
      .catch((err) => {
        setSuccessMessage(err?.response?.data?.message);
      })
  }


  return (
    <section className="flex gap-10 justify-between">

      <div className="w-[50%]">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
            {/* Display Selected Image Preview */}
            <img className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0" src={preview} alt="Profile" />

            <div>
              <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                Profile picture
              </h3>
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                JPG, GIF, or PNG. Max size: 800KB
              </div>

              {/* File Input */}
              <input
                id="fileInput"
                type="file"
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileInput"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Choose Image
              </label>
            </div>
          </div>
        </div>
      </div>


      <div className="w-full p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold dark:text-white">
          General Information
        </h3>
        <form onSubmit={HandelSubmit}>
          <label className="relative inline-flex items-center mb-4 cursor-pointer">
            <input
              type="checkbox"
              disabled={loadingForToggle}
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
          <br />
          <div className="mb-2 text-green-500 text-sm">
            {responseForToggle && responseForToggle}
          </div>

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
                Last Name
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
                Specialite
              </label>
              <input
                type="text"
                name="specialite"
                id="specialite"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Specialization"
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
                Phone Number
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
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="tt"
                required
                disabled
                readOnly
                value={DataForm.email}
                onChange={HandelChange}
              />
            </div>
          </div>

          <div className="grid mt-3 grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="date_of_birth"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                id="date_of_birth"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Date of birth"
                required
                value={DataForm.date_of_birth}
                onChange={HandelChange}
              />
            </div>
            <div className="col-span-6  sm:col-span-3">
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={DataForm.gender}
                onChange={HandelChange}
                className={`bg-gray-50 !border text-xs rounded-lg block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-gray-300 text-gray-900}`}
              >
                <option value="#" selected disabled  >--Select Gender--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="transgender">Transgender</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-full mt-4 mb-4">
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                About
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
                Name of clinic
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
                Address of clinic
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
          <div className="col-span-6 sm:col-span-3 mt-5">
            <label
              htmlFor="cin"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              CIN
            </label>
            <input
              type="text"
              name="cin"
              id="cin"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="cin"
              required
              value={DataForm.cin}
              onChange={HandelChange}
            />
          </div>
          <div className="w-full flex gap-2 items-center justify-center mt-5">
            <h1 className="text-2xl font-semibold">Experience Fields</h1>
            <span className="flex-1 border-t border-black" />
            <button type="button" onClick={() => setShowExpFields(prev => !prev)}>
              <ChevronDownIcon className={`w-5 h-5 ${showExpFields ? 'rotate-180' : 'rotate-0'}`} />
            </button>
          </div>
          {showExpFields &&
            <>
              <div className="w-44 mt-5 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Total Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience_years"
                  readOnly
                  disabled
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 disabled:opacity-80"
                  value={doctorData?.doctor?.experience_years}
                />
              </div>

              {experienceList?.map((experience, index) => (
                <div key={index} className="border p-4 rounded-lg mt-5">
                  <div className="grid mt-3 grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Experience Start Date
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                        value={experience.start_date}
                        onChange={(e) => handleChangeInExperience(e, index)}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Experience End Date
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                        value={experience.end_date}
                        onChange={(e) => handleChangeInExperience(e, index)}
                      />
                    </div>
                  </div>

                  <div className="grid mt-3 grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Experience Institute
                      </label>
                      <input
                        type="text"
                        name="institute"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                        placeholder="Enter institute name"
                        value={experience.institute}
                        onChange={(e) => handleChangeInExperience(e, index)}
                      />
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
                        name="detail"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter your experience details"
                        onChange={(e) => handleChangeInExperience(e, index)}
                        value={experience.detail}
                      ></textarea>
                    </div>
                    <div className="col-span-6 flex flex-col gap-2">
                      <label
                        htmlFor="degree_certificates"
                        className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                      >
                        Experience Certificates
                        <p className="text-sm font-light">Upload Education/Experience/Degree (documents)</p>
                      </label>
                      <input
                        type="file"
                        name="degree_certificates"
                        accept="image/png, image/jpeg, image/gif"
                        multiple
                        onChange={e => handleChangeInExperience(e, index)}
                      />
                    </div>
                    <div className="col-span-6 flex flex-col gap-2">
                      {experience?.degree_certificates?.length > 0 &&
                        experience.degree_certificates.map((certificate, certificateIndex) => (
                          <div key={certificateIndex} className="w-full flex-1">
                            {typeof certificate === "string" ? (
                              // Existing file (URL)
                              <a href={certificate} target="_blank" rel="noopener noreferrer" className=" text-blue-500 underline">
                                {certificate}
                              </a>
                            ) : (
                              // New file (File object)
                              <span className="flex-1 text-gray-700">{certificate.name}</span>
                            )}
                          </div>
                        ))
                      }
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
                type="button"
                onClick={addExperience}
                className="bg-yellow-400 text-white px-4 py-2 rounded-lg mt-4"
              >
                Add More Experiences
              </button>
            </>
          }
          <div className="flex items-center gap-5 w-full mt-10">
            <div className="col-span-6 sm:col-full  w-[20%]">
              <AuthButton Text="Save all" Loading={loading} isDisabled={DataForm.verified || loadingForToggle} />
            </div>
            <div className="col-span-6 sm:col-full ">
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={handleApprovalClick}
                disabled={loadingForToggle}
              >
                Request for Approval
              </Button>
            </div>
          </div>
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </form>
      </div>
    </section>
  );
};

export default PersonalInformation;
