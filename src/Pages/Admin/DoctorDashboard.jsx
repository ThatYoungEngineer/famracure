import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import axiosClient from "../../AxiosClient";
import { useParams } from 'react-router-dom';
import GetAuthAdmin from "../../hooks/GetAuthAdmin";
import { AuthButton, NavBarAdmin, SidebarAdmin } from "../../Components";
import { Button } from "@mui/material";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const DoctorDashboard = () => {
    document.title = "Payments";

    const { id } = useParams()

    const [error, setError] = useState(null)
    const [DataForm, setDataForm] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [doctorDashboardData, setDoctorDashboardData] = useState(null)


    const [successMessage, setSuccessMessage] = useState("")
    const [loading, setLoading] = useState(false);
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
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const [showExpFields, setShowExpFields] = useState(false)

    GetAuthAdmin()

    useEffect(() => {
        fetchDoctorDashboard()
    }, [id])

    useEffect(() => {
        if (doctorDashboardData?.doctor !== null) {
            setDataForm({
                id: doctorDashboardData?.doctor.id,
                firstname: doctorDashboardData?.doctor.firstname || "",
                lastname: doctorDashboardData?.doctor.lastname || "",
                gender: doctorDashboardData?.doctor.gender || "",
                cin: doctorDashboardData?.doctor.cin || "",
                phoneNumber: doctorDashboardData?.doctor.phoneNumber || "",
                date_of_birth: doctorDashboardData?.doctor.date_of_birth || "",
                email: doctorDashboardData?.doctor.email || "",
                Matricule: doctorDashboardData?.doctor.matricule || "",
                specialite: doctorDashboardData?.doctor.specialite || "",
                nom_cabinet: doctorDashboardData?.doctor.nom_cabinet || "",
                address_cabinet: doctorDashboardData?.doctor.address_cabinet || "",
                available: doctorDashboardData?.doctor.available == "1" ? true : false,
                verified: doctorDashboardData?.doctor.verified == "1" ? true : false,
                about: doctorDashboardData?.doctor.about || "",
                experience_years: doctorDashboardData?.doctor.experience_years || "",
                experience: doctorDashboardData?.doctor.experience || [],
            })
            if (doctorDashboardData?.doctor?.experience?.length > 0) {
                setExperienceList(doctorDashboardData?.doctor?.experience); // Ensure it's updated
            }
            setPreviewAvatar(doctorDashboardData?.doctor.avatar_doctor || "/img/Rectangle 4.jpg"); // Default if no avatar
        }
    }, [doctorDashboardData])

    const fetchDoctorDashboard = async () => {
        setDoctorDashboardData(null)
        setError(null)
        setIsLoading(true)
        try {
            const response = await axiosClient.get(`admin/doctor-dashboard/${id}`);
            console.log('doctorDashboardData response: ', response)
            if (response.status === 200) {
                setDoctorDashboardData(response.data);
            }

        } catch (error) {
            console.error(error);
            setError(error.response.data.message)
        } finally {
            setIsLoading(false)
        }
    };

    const HandelChangeCheckbox = (e) => {
        const isChecked = e.target.checked
        setDataForm({
            ...DataForm,
            available: isChecked
        })
    };

    const HandelChange = (e, index) => {
        const { name, value } = e.target;
        setDataForm({ ...DataForm, [name]: value });
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


    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();


        const formData = new FormData();

        formData.append("doctor[firstname]", DataForm.firstname);
        formData.append("doctor[lastname]", DataForm.lastname);
        formData.append("doctor[cin]", DataForm.cin);
        formData.append("doctor[phoneNumber]", DataForm.phoneNumber);
        formData.append("doctor[email]", DataForm.email);
        formData.append("doctor[specialite]", DataForm.specialite);
        formData.append("doctor[gender]", DataForm.gender);
        formData.append("doctor[date_of_birth]", DataForm.date_of_birth);
        formData.append("doctor[available]", DataForm.available ? 1 : 0);

        // Append avatar file if available
        if (selectedAvatar) {
            formData.append("avatar_doctor", selectedAvatar);
        }

        // Append experiences as a JSON string
        experienceList.forEach((experience, index) => {
            formData.append(`experiences[${index}][institute]`, experience.institute);
            formData.append(`experiences[${index}][city]`, experience.city);
            formData.append(`experiences[${index}][country]`, experience.country);
            formData.append(`experiences[${index}][start_date]`, experience.start_date);
            formData.append(`experiences[${index}][end_date]`, experience.end_date);
            formData.append(`experiences[${index}][detail]`, experience.detail);

            if (experience.degree_certificates) {
                experience.degree_certificates.forEach((file, fileIndex) => {
                    if (typeof file !== "string") {
                        formData.append(`experiences[${index}][degree_certificates][${fileIndex}]`, file);
                    }
                });
            }
        });

        setSuccessMessage("");

        // Send request with FormData
        axiosClient.post(`/doctors/${doctorDashboardData?.doctor.id}/dashboard`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((res) => {
                console.log('admin ads: ', res);
                setSuccessMessage(res?.data?.message);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedAvatar(file);
            setPreviewAvatar(URL.createObjectURL(file)); // Show preview
        }
    };

    const handleApproveDoctor = () => {
        axiosClient
            .post(`/admin/approve-doctor/${doctorDashboardData?.doctor.id}`, {
                verified: 1
            })
            .then((res) => {
                const success = res?.data?.message;
                if (success) {
                    setSuccessMessage(success);
                    setDataForm(prev => ({
                        ...prev,
                        verified: 1
                    }))
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleRejectDoctor = () => {
        axiosClient
            .post(`/admin/approve-doctor/${doctorDashboardData?.doctor.id}`, {
                verified: 0
            })
            .then((res) => {
                const success = res?.data?.message;
                if (success) {
                    setSuccessMessage(success);
                    setDataForm(prev => ({
                        ...prev,
                        verified: 0
                    }))
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            <NavBarAdmin />
            <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
                <SidebarAdmin />
                <div
                    id="main-content"
                    className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
                >
                    {isLoading && <div className="w-[85vw] h-screen flex items-center justify-center"> <Spinner size={'xl'} /> </div>}
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    {doctorDashboardData &&
                        <section className="w-full p-6 bg-white shadow-lg rounded-lg">
                            <h1 className="text-center text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Doctor Dashboard</h1>

                            <div className="space-y-4">
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-700">Doctor Details</h2>
                                    <p className="text-gray-600"><span className="font-medium">ID:</span> {doctorDashboardData?.doctor.id || "N/A"}</p>
                                    <div className='flex flex-col gap-1 items-center justify-center mb-5'>
                                        <label htmlFor="user_avatar">Profile Photo</label>
                                        <img src={previewAvatar ? previewAvatar : doctorDashboardData?.doctor.avatar_doctor} name="user_avatar" id='user_avatar' alt="profile_picture" className='w-40 h-40 rounded-md border bg-gray-300' />
                                        <input type="file" name="user_avatar" id="user_avatar" accept="image/*" onChange={handleAvatarChange} className="mt-2" />
                                    </div>
                                    <>
                                        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                                            <h3 className="mb-4 text-xl font-semibold dark:text-white">
                                                General Information
                                            </h3>
                                            <form onSubmit={handleSubmit}>
                                                <div className="w-full flex items-center justify-center">
                                                    <div className="mb-5">
                                                        <label className="text-sm font-medium text-gray-900">
                                                            Doctor Availability
                                                        </label>
                                                        <div className="flex items-center space-x-6 mt-2">
                                                            <label className="flex items-center space-x-2">
                                                                <input
                                                                    type="radio"
                                                                    name="available"
                                                                    value={1}
                                                                    checked={DataForm.available}
                                                                    onChange={(e) => setDataForm({ ...DataForm, available: 1 })}
                                                                    className="form-radio text-blue-600"
                                                                />
                                                                <span className="text-sm text-gray-900">Available</span>
                                                            </label>

                                                            <label className="flex items-center space-x-2">
                                                                <input
                                                                    type="radio"
                                                                    name="available"
                                                                    value={0}
                                                                    checked={!DataForm.available}
                                                                    onChange={(e) => setDataForm({ ...DataForm, available: 0 })}
                                                                    className="form-radio text-red-600"
                                                                />
                                                                <span className="text-sm text-gray-900">Unavailable</span>
                                                            </label>
                                                        </div>
                                                    </div>
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
                                                    <div className="col-span-6 sm:col-span-3 cursor-not-allowed">
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
                                                            disabled
                                                            readOnly
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
                                                            placeholder="tt"
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
                                                    <div className="col-span-6 sm:col-span-3">
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
                                                            disabled
                                                            readOnly
                                                            value={DataForm.email}
                                                            onChange={HandelChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-6 sm:col-span-3 mt-3">
                                                    <label
                                                        htmlFor="cin"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        CIN
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="cin"
                                                        id="cin"
                                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="cin"
                                                        disabled
                                                        readOnly
                                                        value={DataForm.cin}
                                                        onChange={HandelChange}
                                                    />
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
                                                            placeholder="date_of_birth"
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
                                                            className={`bg-gray-50 p-2 !border text-base rounded-lg block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-gray-300 text-gray-900}`}
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
                                                            {" "}
                                                            About{" "}
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

                                                <div className="w-full flex gap-2 items-center justify-center mt-10">
                                                    <h1 className="text-2xl font-semibold">Experience Fields</h1>
                                                    <span className="flex-1 border-t border-black" />
                                                    <button type="button" onClick={() => setShowExpFields(prev => !prev)}>
                                                        <ChevronDownIcon className={`w-5 h-5 ${showExpFields ? 'rotate-180' : 'rotate-0'}`} />
                                                    </button>
                                                </div>

                                                {showExpFields &&
                                                    <>
                                                        {experienceList.map((experience, index) => (
                                                            <div key={index} className="border p-4 rounded-lg mt-10">
                                                                <div className="w-44 mt-5 sm:col-span-3">
                                                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                        Experience (Years)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        name="experience_years"
                                                                        readOnly
                                                                        disabled
                                                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 disabled:opacity-80"
                                                                        value={experience.experience_years}
                                                                    />
                                                                </div>
                                                                <h1 className="text-xl font-semibold mt-5">Institute Details</h1>
                                                                <div className="grid mt-3 grid-cols-6 gap-x-6 gap-y-3">
                                                                    <div className="col-span-6 sm:col-span-3">
                                                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                            Institute Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="institute"
                                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                                                            value={experience.institute}
                                                                            onChange={(e) => handleChangeInExperience(e, index)}
                                                                        />
                                                                    </div>

                                                                    <div className="col-span-6 sm:col-span-3">
                                                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                            Institute City
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="city"
                                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                                                            value={experience.city}
                                                                            onChange={(e) => handleChangeInExperience(e, index)}
                                                                        />
                                                                    </div>
                                                                    <div className="col-span-6 sm:col-span-3">
                                                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                            Institute Country
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="country"
                                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                                                                            value={experience.country}
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
                                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                        >
                                                                            Experience Certificates
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

                                                            </div>
                                                        ))}
                                                    </>
                                                }
                                                <div className="w-full flex items-center gap-5 mt-10">
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        disabled={loading}
                                                    >
                                                        Update Doctor
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="contained"
                                                        color="warning"
                                                        disabled={DataForm.verified == 1}
                                                        onClick={handleApproveDoctor}
                                                    >
                                                        Approve Doctor
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="contained"
                                                        color="error"
                                                        disabled={DataForm.verified == 0}
                                                        onClick={handleRejectDoctor}
                                                    >
                                                        Reject Doctor
                                                    </Button>
                                                </div>
                                                {successMessage && <p className="text-green-500">{successMessage}</p>}
                                            </form>
                                        </div>
                                    </>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="my-5 border bg-green-200 text-green-700 p-5 rounded-md flex flex-col items-center justify-center gap-2">
                                    <h3 className="text-lg font-semibold">Total Appointments</h3>
                                    <p className="text-2xl font-semibold">{doctorDashboardData?.appointments.length}</p>
                                </div>
                                <div className="overflow-x-auto">
                                    {doctorDashboardData?.appointments.length > 0 ? (
                                        <table className="min-w-full border-collapse border border-gray-200">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border p-2">ID</th>
                                                    <th className="border p-2">Status</th>
                                                    <th className="border p-2">User ID</th>
                                                    <th className="border p-2">Doctor ID</th>
                                                    <th className="border p-2">Appointment Type</th>
                                                    <th className="border p-2">Appointment Date</th>
                                                    <th className="border p-2">Appointment Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {doctorDashboardData?.appointments.map((appointment, index) => (
                                                    <tr key={index} className="odd:bg-white even:bg-gray-50">
                                                        <td className="border p-2">{appointment.id}</td>
                                                        <td className="border p-2">{appointment.status}</td>
                                                        <td className="border p-2">{appointment.user_id || 'NULL'}</td>
                                                        <td className="border p-2">{appointment.doctor_id || 'NULL'}</td>
                                                        <td className="border p-2">{appointment.appointment_type}</td>
                                                        <td className="border p-2">{appointment.appointment_date}</td>
                                                        <td className="border p-2">{appointment.appointment_time}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">No Appointments found</div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="my-10 border bg-yellow-200 text-yellow-700 p-5 rounded-md flex flex-col items-center justify-center gap-2">
                                    <h3 className="text-lg font-semibold">Total Reviews</h3>
                                    <p className="text-2xl font-semibold">{doctorDashboardData?.reviews.length}</p>
                                </div>
                                {doctorDashboardData?.reviews.length > 0 ?
                                    <table className="min-w-full border-collapse border border-gray-200">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border p-2">ID</th>
                                                <th className="border p-2">User ID</th>
                                                <th className="border p-2">Doctor ID</th>
                                                <th className="border p-2">Rating</th>
                                                <th className="border p-2">Comments</th>
                                                <th className="border p-2">Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {doctorDashboardData?.reviews.map((review, index) => (
                                                <tr key={index} className="odd:bg-white even:bg-gray-50">
                                                    <td className="border p-2">{review.id}</td>
                                                    <td className="border p-2">{review.user_id || 'NULL'}</td>
                                                    <td className="border p-2">{review.doctor_id || 'NULL'}</td>
                                                    <td className="border p-2">{review.rating}</td>
                                                    <td className="border p-2">{review.comments}</td>
                                                    <td className="border p-2">{new Date(review.created_at).toLocaleDateString('en-CA')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    : (
                                        <div className="p-4 text-center text-gray-500">No Reviews found</div>
                                    )}
                            </div>
                        </section>
                    }
                </div>
            </div>
        </>
    );
};

export default DoctorDashboard
