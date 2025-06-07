"use client"

import { Spinner } from "flowbite-react"
import { useEffect, useState } from "react"
import axiosClient from "../../AxiosClient"
import { useParams } from "react-router-dom"
import GetAuthAdmin from "../../hooks/GetAuthAdmin"
import { NavBarAdmin, SidebarAdmin } from "../../Components"
import { Button } from "@mui/material"
import { ChevronDownIcon } from "@heroicons/react/20/solid"

const DoctorDashboard = () => {
    document.title = "Doctor Dashboard"

    const { id } = useParams()

    const [error, setError] = useState(null)
    const [DataForm, setDataForm] = useState({
        id: "",
        firstname: "",
        lastname: "",
        gender: "",
        cin: "",
        phoneNumber: "",
        date_of_birth: "",
        email: "",
        Matricule: "",
        specialite: "",
        nom_cabinet: "",
        address_cabinet: "",
        available: false,
        verified: false,
        about: "",
        experience_years: "",
        experience: [],
    })
    const [isLoading, setIsLoading] = useState(false)
    const [doctorDashboardData, setDoctorDashboardData] = useState(null)

    const [successMessage, setSuccessMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [experienceList, setExperienceList] = useState([
        {
            institute: "",
            city: "",
            country: "",
            start_date: "",
            end_date: "",
            experience_years: 0,
            detail: "",
            degree_certificates: [],
        },
    ])
    const [previewAvatar, setPreviewAvatar] = useState(null)
    const [selectedAvatar, setSelectedAvatar] = useState(null)
    const [showExpFields, setShowExpFields] = useState(false)

    GetAuthAdmin()

    const fetchDoctorDashboard = async () => {
        setDoctorDashboardData(null)
        setError(null)
        setIsLoading(true)
        try {
            const response = await axiosClient.post(`/doctors/${id}/dashboard`)
            console.log("doctorDashboardData response: ", response.data)
            setDoctorDashboardData(response.data)
        } catch (error) {
            console.error(error)
            setError("An error occurred while loading the data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchDoctorDashboard()
        }
    }, [id])

    useEffect(() => {
        if (doctorDashboardData?.doctor) {
            const doctor = doctorDashboardData.doctor
            console.log("Setting form data with doctor:", doctor)

            setDataForm({
                id: doctor.id || "",
                firstname: doctor.firstname || "",
                lastname: doctor.lastname || "",
                gender: doctor.gender || "",
                cin: doctor.cin || "",
                phoneNumber: doctor.phoneNumber || "",
                date_of_birth: doctor.date_of_birth || "",
                email: doctor.email || "",
                Matricule: doctor.Matricule || "",
                specialite: doctor.specialite || "",
                nom_cabinet: doctor.nom_cabinet || "",
                address_cabinet: doctor.address_cabinet || "",
                available: doctor.available === 1 || doctor.available === "1" || doctor.available === true,
                verified: doctor.verified === 1 || doctor.verified === "1" || doctor.verified === true,
                about: doctor.about || "",
                experience_years: doctor.experience_years || "",
                experience: doctor.experience || [],
            })

            if (doctor.experience && doctor.experience.length > 0) {
                setExperienceList(doctor.experience)
            }

            setPreviewAvatar(doctor.avatar_doctor || "/img/Rectangle 4.jpg")
        }
    }, [doctorDashboardData])

    const HandelChange = (e) => {
        const { name, value } = e.target
        setDataForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleChangeInExperience = (e, index) => {
        const { name, value, files } = e.target

        setExperienceList((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [name]:
                            name === "degree_certificates" ? [...(item[name] ? [...item[name]] : []), ...Array.from(files)] : value,
                    }
                    : item,
            ),
        )
    }

    const handleSubmit = (e) => {
        setLoading(true)
        e.preventDefault()

        const formData = new FormData()

        formData.append("doctor[firstname]", DataForm.firstname)
        formData.append("doctor[lastname]", DataForm.lastname)
        formData.append("doctor[cin]", DataForm.cin)
        formData.append("doctor[phoneNumber]", DataForm.phoneNumber)
        formData.append("doctor[email]", DataForm.email)
        formData.append("doctor[specialite]", DataForm.specialite)
        formData.append("doctor[gender]", DataForm.gender)
        formData.append("doctor[date_of_birth]", DataForm.date_of_birth)
        formData.append("doctor[available]", DataForm.available ? 1 : 0)

        if (selectedAvatar) {
            formData.append("avatar_doctor", selectedAvatar)
        }

        experienceList.forEach((experience, index) => {
            formData.append(`experiences[${index}][institute]`, experience.institute)
            formData.append(`experiences[${index}][city]`, experience.city)
            formData.append(`experiences[${index}][country]`, experience.country)
            formData.append(`experiences[${index}][start_date]`, experience.start_date)
            formData.append(`experiences[${index}][end_date]`, experience.end_date)
            formData.append(`experiences[${index}][detail]`, experience.detail)

            if (experience.degree_certificates) {
                experience.degree_certificates.forEach((file, fileIndex) => {
                    if (typeof file !== "string") {
                        formData.append(`experiences[${index}][degree_certificates][${fileIndex}]`, file)
                    }
                })
            }
        })

        setSuccessMessage("")

        axiosClient
            .post(`/doctors/${doctorDashboardData?.doctor.id}/dashboard`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log("Update response: ", res)
                setSuccessMessage(res?.data?.message)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedAvatar(file)
            setPreviewAvatar(URL.createObjectURL(file))
        }
    }

    const handleApproveDoctor = () => {
        axiosClient
            .post(`/admin/approve-doctor/${doctorDashboardData?.doctor.id}`, {
                verified: 1,
            })
            .then((res) => {
                const success = res?.data?.message
                if (success) {
                    setSuccessMessage(success)
                    setDataForm((prev) => ({
                        ...prev,
                        verified: true,
                    }))
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleRejectDoctor = () => {
        axiosClient
            .post(`/admin/approve-doctor/${doctorDashboardData?.doctor.id}`, {
                verified: 0,
            })
            .then((res) => {
                const success = res?.data?.message
                if (success) {
                    setSuccessMessage(success)
                    setDataForm((prev) => ({
                        ...prev,
                        verified: false,
                    }))
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    if (isLoading) {
        return (
            <>
                <NavBarAdmin />
                <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
                    <SidebarAdmin />
                    <div className="w-full lg:w-[85vw] h-screen flex items-center justify-center">
                        <Spinner size={"xl"} />
                    </div>
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <NavBarAdmin />
                <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
                    <SidebarAdmin />
                    <div className="w-full lg:w-[85vw] text-red-500 text-center p-8">{error}</div>
                </div>
            </>
        )
    }

    if (!doctorDashboardData) {
        return (
            <>
                <NavBarAdmin />
                <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
                    <SidebarAdmin />
                    <div className="w-full lg:w-[85vw] text-center p-8">No data available</div>
                </div>
            </>
        )
    }

    return (
        <>
            <NavBarAdmin />
            <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
                <SidebarAdmin />
                {/* Main Content - Fixed for mobile responsiveness */}
                <div
                    id="main-content"
                    className="relative w-full min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900
                     px-4 sm:px-6 lg:ml-64 lg:px-8"
                    style={{
                        // Ensure content is visible on all screen sizes
                        display: "block",
                        visibility: "visible",
                        minHeight: "100vh",
                        width: "100%",
                        maxWidth: "100vw",
                        overflowX: "hidden",
                    }}
                >
                    <section className="w-full max-w-full p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg my-4">
                        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-6 border-b pb-2">
                            Doctor Dashboard
                        </h1>

                        <div className="space-y-4">
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-white mb-4">Doctor Details</h2>

                                {/* Mobile-optimized doctor info */}
                                <div className="space-y-2 text-sm sm:text-base">
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium dark:text-white">ID:</span> {doctorDashboardData?.doctor?.id || "N/A"}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium dark:text-white">Name:</span> {doctorDashboardData?.doctor?.firstname}{" "}
                                        {doctorDashboardData?.doctor?.lastname}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 break-all">
                                        <span className="font-medium dark:text-white">Email:</span> {doctorDashboardData?.doctor?.email}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium dark:text-white">Phone:</span>{" "}
                                        {doctorDashboardData?.doctor?.phoneNumber}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium dark:text-white">Specialty:</span>{" "}
                                        {doctorDashboardData?.doctor?.specialite || "Not specified"}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1 items-center justify-center mb-5 mt-4">
                                    <label htmlFor="user_avatar" className="dark:text-white text-sm sm:text-base">
                                        Profile Photo
                                    </label>
                                    <img
                                        src={previewAvatar || doctorDashboardData?.doctor?.avatar_doctor || "/img/Rectangle 4.jpg"}
                                        name="user_avatar"
                                        id="user_avatar"
                                        alt="profile_picture"
                                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-md border bg-gray-300 object-cover"
                                    />
                                    <input
                                        type="file"
                                        name="user_avatar"
                                        id="user_avatar"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="mt-2 dark:text-white text-sm"
                                    />
                                </div>

                                <div className="p-3 sm:p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <h3 className="mb-4 text-lg sm:text-xl font-semibold dark:text-white">General Information</h3>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Mobile-optimized availability section */}
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                Doctor Availability
                                            </label>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="available"
                                                        value="1"
                                                        checked={DataForm.available === true}
                                                        onChange={() => setDataForm({ ...DataForm, available: true })}
                                                        className="form-radio text-blue-600"
                                                    />
                                                    <span className="text-sm text-gray-900 dark:text-white">Available</span>
                                                </label>

                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="available"
                                                        value="0"
                                                        checked={DataForm.available === false}
                                                        onChange={() => setDataForm({ ...DataForm, available: false })}
                                                        className="form-radio text-red-600"
                                                    />
                                                    <span className="text-sm text-gray-900 dark:text-white">Unavailable</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Mobile-optimized form grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
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
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="First Name"
                                                    required
                                                    value={DataForm.firstname || ""}
                                                    onChange={HandelChange}
                                                />
                                            </div>
                                            <div>
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
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Last Name"
                                                    required
                                                    value={DataForm.lastname || ""}
                                                    onChange={HandelChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
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
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-not-allowed opacity-60"
                                                    placeholder="Matricule"
                                                    disabled
                                                    readOnly
                                                    value={DataForm.Matricule || ""}
                                                />
                                            </div>
                                            <div>
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
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Specialite"
                                                    value={DataForm.specialite || ""}
                                                    onChange={HandelChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
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
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Phone Number"
                                                    required
                                                    value={DataForm.phoneNumber || ""}
                                                    onChange={HandelChange}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-not-allowed opacity-60"
                                                    placeholder="Email"
                                                    disabled
                                                    readOnly
                                                    value={DataForm.email || ""}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="cin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                CIN
                                            </label>
                                            <input
                                                type="text"
                                                name="cin"
                                                id="cin"
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-not-allowed opacity-60"
                                                placeholder="CIN"
                                                disabled
                                                readOnly
                                                value={DataForm.cin || ""}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
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
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    value={DataForm.date_of_birth || ""}
                                                    onChange={HandelChange}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="gender"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Gender
                                                </label>
                                                <select
                                                    name="gender"
                                                    id="gender"
                                                    value={DataForm.gender || ""}
                                                    onChange={HandelChange}
                                                    className="bg-gray-50 p-2 border text-sm rounded-lg block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-gray-300 text-gray-900"
                                                >
                                                    <option value="" disabled>
                                                        --Select Gender--
                                                    </option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="transgender">Transgender</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="about" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                About
                                            </label>
                                            <textarea
                                                id="about"
                                                rows="4"
                                                name="about"
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="About You..."
                                                value={DataForm.about || ""}
                                                onChange={HandelChange}
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
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
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Clinic Name"
                                                    value={DataForm.nom_cabinet || ""}
                                                    onChange={HandelChange}
                                                />
                                            </div>
                                            <div>
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
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Clinic Address"
                                                    value={DataForm.address_cabinet || ""}
                                                    onChange={HandelChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full flex gap-2 items-center justify-center mt-8">
                                            <h1 className="text-lg sm:text-2xl font-semibold">Experience Fields</h1>
                                            <span className="flex-1 border-t border-black" />
                                            <button type="button" onClick={() => setShowExpFields((prev) => !prev)}>
                                                <ChevronDownIcon
                                                    className={`w-5 h-5 transition-transform ${showExpFields ? "rotate-180" : "rotate-0"}`}
                                                />
                                            </button>
                                        </div>

                                        {showExpFields && experienceList.length > 0 && (
                                            <div className="space-y-6">
                                                {experienceList.map((experience, index) => (
                                                    <div key={index} className="border p-4 rounded-lg">
                                                        <div className="mb-4">
                                                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                Experience (Years)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="experience_years"
                                                                readOnly
                                                                disabled
                                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full sm:w-44 p-2.5 disabled:opacity-80"
                                                                value={experience.experience_years || 0}
                                                            />
                                                        </div>
                                                        <h1 className="text-lg sm:text-xl font-semibold mb-4">Institute Details</h1>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    Institute Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="institute"
                                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                                    value={experience.institute || ""}
                                                                    onChange={(e) => handleChangeInExperience(e, index)}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    Institute City
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="city"
                                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                                    value={experience.city || ""}
                                                                    onChange={(e) => handleChangeInExperience(e, index)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    Institute Country
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="country"
                                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                                    value={experience.country || ""}
                                                                    onChange={(e) => handleChangeInExperience(e, index)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                                            <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    Experience Start Date
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    name="start_date"
                                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                                    value={experience.start_date || ""}
                                                                    onChange={(e) => handleChangeInExperience(e, index)}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    Experience End Date
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    name="end_date"
                                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                                    value={experience.end_date || ""}
                                                                    onChange={(e) => handleChangeInExperience(e, index)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <label
                                                                htmlFor="experience_detail"
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Experience Detail
                                                            </label>
                                                            <textarea
                                                                id="experience_detail"
                                                                rows="4"
                                                                name="detail"
                                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                placeholder="Enter your experience details"
                                                                onChange={(e) => handleChangeInExperience(e, index)}
                                                                value={experience.detail || ""}
                                                            ></textarea>
                                                        </div>
                                                        <div className="mt-4">
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
                                                                onChange={(e) => handleChangeInExperience(e, index)}
                                                                className="text-sm"
                                                            />
                                                        </div>
                                                        <div className="mt-2">
                                                            {experience?.degree_certificates?.length > 0 &&
                                                                experience.degree_certificates.map((certificate, certificateIndex) => (
                                                                    <div key={certificateIndex} className="w-full flex-1 mb-2">
                                                                        {typeof certificate === "string" ? (
                                                                            <a
                                                                                href={certificate}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-500 underline text-sm break-all"
                                                                            >
                                                                                {certificate}
                                                                            </a>
                                                                        ) : (
                                                                            <span className="flex-1 text-gray-700 text-sm">{certificate.name}</span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Mobile-optimized buttons */}
                                        <div className="w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-5 mt-8">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={loading}
                                                className="w-full sm:w-auto"
                                                size="small"
                                            >
                                                {loading ? "Updating..." : "Update Doctor"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="contained"
                                                color="warning"
                                                disabled={DataForm.verified === true}
                                                onClick={handleApproveDoctor}
                                                className="w-full sm:w-auto"
                                                size="small"
                                            >
                                                Approve Doctor
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="contained"
                                                color="error"
                                                disabled={DataForm.verified === false}
                                                onClick={handleRejectDoctor}
                                                className="w-full sm:w-auto"
                                                size="small"
                                            >
                                                Reject Doctor
                                            </Button>
                                        </div>
                                        {successMessage && <p className="text-green-500 mt-4 text-sm">{successMessage}</p>}
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Mobile-optimized Appointments Section */}
                        <div className="space-y-4 mt-8">
                            <div className="my-5 border bg-green-200 dark:bg-green-900 text-green-700 dark:text-green-200 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                                <h3 className="text-base sm:text-lg font-semibold">Total Appointments</h3>
                                <p className="text-xl sm:text-2xl font-semibold">{doctorDashboardData?.appointments?.length || 0}</p>
                            </div>
                            <div className="overflow-x-auto">
                                {doctorDashboardData?.appointments && doctorDashboardData.appointments.length > 0 ? (
                                    <div className="min-w-full">
                                        {/* Mobile card view for appointments */}
                                        <div className="block sm:hidden space-y-4">
                                            {doctorDashboardData.appointments.map((appointment, index) => (
                                                <div key={appointment.id || index} className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                                                    <div className="space-y-2 text-sm">
                                                        <div>
                                                            <span className="font-medium">ID:</span> {appointment.id}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Status:</span>{" "}
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs ${
                                                                    appointment.status === "pending"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : appointment.status === "confirmed"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : appointment.status === "cancelled"
                                                                                ? "bg-red-100 text-red-800"
                                                                                : "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                {appointment.status}
                              </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">User ID:</span> {appointment.user_id || "N/A"}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Doctor ID:</span> {appointment.doctor_id}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Type:</span>{" "}
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs ${
                                                                    appointment.appointment_type === "video"
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : "bg-purple-100 text-purple-800"
                                                                }`}
                                                            >
                                {appointment.appointment_type}
                              </span>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Date:</span> {appointment.appointment_date}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Time:</span> {appointment.appointment_time}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Desktop table view */}
                                        <table className="hidden sm:table min-w-full border-collapse border border-gray-200 dark:border-gray-700">
                                            <thead>
                                            <tr className="bg-gray-100 dark:bg-gray-700">
                                                <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">ID</th>
                                                <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">Status</th>
                                                <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">User ID</th>
                                                <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">Doctor ID</th>
                                                <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">Type</th>
                                                <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">Date</th>
                                                <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">Time</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {doctorDashboardData.appointments.map((appointment, index) => (
                                                <tr
                                                    key={appointment.id || index}
                                                    className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                                                >
                                                    <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                                                        {appointment.id}
                                                    </td>
                                                    <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                              <span
                                  className={`px-2 py-1 rounded text-xs ${
                                      appointment.status === "pending"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : appointment.status === "confirmed"
                                              ? "bg-green-100 text-green-800"
                                              : appointment.status === "cancelled"
                                                  ? "bg-red-100 text-red-800"
                                                  : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {appointment.status}
                              </span>
                                                    </td>
                                                    <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                                                        {appointment.user_id || "N/A"}
                                                    </td>
                                                    <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                                                        {appointment.doctor_id}
                                                    </td>
                                                    <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                              <span
                                  className={`px-2 py-1 rounded text-xs ${
                                      appointment.appointment_type === "video"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-purple-100 text-purple-800"
                                  }`}
                              >
                                {appointment.appointment_type}
                              </span>
                                                    </td>
                                                    <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                                                        {appointment.appointment_date}
                                                    </td>
                                                    <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                                                        {appointment.appointment_time}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">No Appointments found</div>
                                )}
                            </div>
                        </div>

                        {/* Mobile-optimized Reviews Section */}
                        <div className="space-y-4 mt-8">
                            <div className="my-8 border bg-yellow-200 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                                <h3 className="text-base sm:text-lg font-semibold">Total Reviews</h3>
                                <p className="text-xl sm:text-2xl font-semibold">{doctorDashboardData?.reviews?.length || 0}</p>
                            </div>
                            {doctorDashboardData?.reviews && doctorDashboardData.reviews.length > 0 ? (
                                <div className="overflow-x-auto">
                                    {/* Mobile card view for reviews */}
                                    <div className="block sm:hidden space-y-4">
                                        {doctorDashboardData.reviews.map((review, index) => (
                                            <div key={review.id || index} className="bg-white dark:bg-gray-700 p-4 rounded-lg border">
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <span className="font-medium">ID:</span> {review.id}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">User ID:</span> {review.user_id || "N/A"}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Doctor ID:</span> {review.doctor_id}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Rating:</span>
                                                        <div className="flex items-center mt-1">
                                                            <span className="text-yellow-400">{"★".repeat(review.rating)}</span>
                                                            <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                                                            <span className="ml-1">({review.rating})</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Comments:</span> {review.comments}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Date:</span>{" "}
                                                        {new Date(review.created_at).toLocaleDateString("en-CA")}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop table view */}
                                    <table className="hidden sm:table min-w-full border-collapse border border-gray-200 dark:border-gray-700">
                                        <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-700">
                                            <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">ID</th>
                                            <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">User ID</th>
                                            <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">Doctor ID</th>
                                            <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">Rating</th>
                                            <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">Comments</th>
                                            <th className="border p-2 dark:border-gray-600 dark:text-white text-sm">Created At</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {doctorDashboardData.reviews.map((review, index) => (
                                            <tr
                                                key={review.id || index}
                                                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                                            >
                                                <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">{review.id}</td>
                                                <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                                                    {review.user_id || "N/A"}
                                                </td>
                                                <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                                                    {review.doctor_id}
                                                </td>
                                                <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                                                    <div className="flex items-center">
                                                        <span className="text-yellow-400">{"★".repeat(review.rating)}</span>
                                                        <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                                                        <span className="ml-1">({review.rating})</span>
                                                    </div>
                                                </td>
                                                <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">{review.comments}</td>
                                                <td className="border p-2 dark:border-gray-600 dark:text-white text-sm">
                                                    {new Date(review.created_at).toLocaleDateString("en-CA")}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">No Reviews found</div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default DoctorDashboard
