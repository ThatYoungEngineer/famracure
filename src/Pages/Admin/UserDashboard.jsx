"use client"

import { useEffect, useState } from "react"
import axiosClient from "../../AxiosClient"
import { NavBarAdmin, SidebarAdmin } from "../../Components"
import { useParams } from "react-router"
import { Spinner } from "flowbite-react"

const UserDashboard = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [updatedFields, setUpdatedFields] = useState({})
  const [userDashboardData, setUserDashboardData] = useState(null)
  const [previewAvatar, setPreviewAvatar] = useState(null)
  const [selectedAvatar, setSelectedAvatar] = useState(null)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedAvatar(file)
      setPreviewAvatar(URL.createObjectURL(file)) // Show preview
    }
  }

  const { id } = useParams()

  useEffect(() => {
    fetchUserDashboard()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setUpdatedFields((prev) => ({
      ...prev,
      [name]: value, // Track only the changed field
    }))
  }

  const fetchUserDashboard = async () => {
    setUserDashboardData(null)
    setError(null)
    setIsLoading(true)
    try {
      const response = await axiosClient.get(`admin/user-dashboard/${id}`)
      if (response.status === 200) {
        setUserDashboardData(response.data)
        setUpdatedFields(response.data.user) // Correctly initialize updatedFields
      }
    } catch (error) {
      setError(error.response.data.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserUpdate = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append("firstname", updatedFields.firstname)
    formData.append("lastname", updatedFields.lastname)
    formData.append("cin", updatedFields.cin)
    formData.append("email", userDashboardData?.user.email)
    if (selectedAvatar) {
      formData.append("user_avatar", selectedAvatar)
    }

    try {
      const response = await axiosClient.post(`/user/dashboard/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      alert(response.data.message)
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  console.log("userDashboardData: ", userDashboardData)

  return (
      <>
        <NavBarAdmin />
        <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <SidebarAdmin />
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
            {isLoading && (
                <div className="w-full h-screen flex items-center justify-center">
                  <Spinner size={"xl"} />
                </div>
            )}
            {error && <div className="text-red-500 text-center p-4 text-sm sm:text-base">{error}</div>}
            {userDashboardData && (
                <section className="w-full max-w-full p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg my-4">
                  <h1 className="text-center text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-6 border-b pb-2">
                    User Dashboard
                  </h1>

                  <div className="space-y-6">
                    {/* User Details Form - Mobile Optimized */}
                    <form
                        className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-lg space-y-4"
                        onSubmit={handleUserUpdate}
                    >
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-white mb-4">User Details</h2>

                      {/* User ID */}
                      <div className="mb-4">
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                          <span className="font-medium">User ID:</span> {userDashboardData?.user.id || "N/A"}
                        </p>
                      </div>

                      {/* Profile Photo - Mobile Optimized */}
                      <div className="flex flex-col gap-2 items-center justify-center mb-6">
                        <label htmlFor="user_avatar" className="text-sm sm:text-base font-medium dark:text-white">
                          Profile Photo
                        </label>
                        <img
                            src={previewAvatar ? previewAvatar : userDashboardData?.user.user_avatar}
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
                            className="mt-2 text-sm dark:text-white"
                        />
                      </div>

                      {/* Form Fields - Mobile Optimized Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                              htmlFor="firstname"
                              className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                          >
                            First Name
                          </label>
                          <input
                              type="text"
                              name="firstname"
                              id="firstname"
                              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              value={updatedFields.firstname ?? userDashboardData?.user.firstname ?? ""}
                              onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <label
                              htmlFor="lastname"
                              className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                          >
                            Last Name
                          </label>
                          <input
                              type="text"
                              name="lastname"
                              id="lastname"
                              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              value={updatedFields.lastname ?? userDashboardData?.user.lastname ?? ""}
                              onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                          Email
                        </label>
                        <input
                            type="email"
                            disabled
                            readOnly
                            name="email"
                            id="email"
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm disabled:opacity-60 disabled:bg-gray-100 dark:disabled:bg-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            value={updatedFields.email ?? userDashboardData?.user.email ?? ""}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                            Gender
                          </label>
                          <select
                              name="gender"
                              id="gender"
                              value={updatedFields.gender ?? userDashboardData?.user.gender ?? ""}
                              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              onChange={handleInputChange}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="transgender">Transgender</option>
                          </select>
                        </div>

                        <div>
                          <label
                              htmlFor="phone_number"
                              className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                          >
                            Phone Number
                          </label>
                          <input
                              type="text"
                              name="phone_number"
                              id="phone_number"
                              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              value={updatedFields.phone_number ?? userDashboardData?.user.phone_number ?? ""}
                              onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                            htmlFor="country_code"
                            className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                        >
                          Country Code
                        </label>
                        <select
                            name="country_code"
                            id="country_code"
                            className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            value={updatedFields.country_code ?? userDashboardData?.user.country_code ?? ""}
                            onChange={handleInputChange}
                        >
                          <option value="+92">+92 (PK)</option>
                          <option value="+1">+1 (USA)</option>
                          <option value="+91">+91 (India)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+61">+61 (Australia)</option>
                          <option value="+81">+81 (Japan)</option>
                          <option value="+49">+49 (Germany)</option>
                          <option value="+33">+33 (France)</option>
                          <option value="+39">+39 (Italy)</option>
                          <option value="+86">+86 (China)</option>
                          <option value="+7">+7 (Russia)</option>
                          <option value="+34">+34 (Spain)</option>
                          <option value="+55">+55 (Brazil)</option>
                          <option value="+27">+27 (South Africa)</option>
                          <option value="+82">+82 (South Korea)</option>
                          <option value="+31">+31 (Netherlands)</option>
                          <option value="+46">+46 (Sweden)</option>
                          <option value="+45">+45 (Denmark)</option>
                          <option value="+47">+47 (Norway)</option>
                          <option value="+48">+48 (Poland)</option>
                          <option value="+90">+90 (Turkey)</option>
                          <option value="+52">+52 (Mexico)</option>
                          <option value="+63">+63 (Philippines)</option>
                          <option value="+60">+60 (Malaysia)</option>
                          <option value="+65">+65 (Singapore)</option>
                          <option value="+20">+20 (Egypt)</option>
                          <option value="+966">+966 (Saudi Arabia)</option>
                          <option value="+971">+971 (UAE)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                              htmlFor="date_of_birth"
                              className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                          >
                            Date of Birth
                          </label>
                          <input
                              type="date"
                              name="date_of_birth"
                              id="date_of_birth"
                              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              value={updatedFields.date_of_birth ?? userDashboardData?.user.date_of_birth ?? ""}
                              onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="cin" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                            CIN
                          </label>
                          <input
                              type="text"
                              name="cin"
                              id="cin"
                              className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              value={updatedFields.cin ?? userDashboardData?.user.cin ?? ""}
                              onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                              htmlFor="email_verified_at"
                              className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                          >
                            Email Verified At
                          </label>
                          <input
                              type="text"
                              disabled
                              readOnly
                              name="email_verified_at"
                              id="email_verified_at"
                              className="w-full p-2.5 border border-gray-300 rounded-md text-sm disabled:opacity-60 disabled:bg-gray-100 dark:disabled:bg-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              value={
                                userDashboardData?.user.email_verified_at
                                    ? new Date(userDashboardData.user.email_verified_at).toLocaleDateString("en-CA")
                                    : "Not verified"
                              }
                          />
                        </div>

                        <div>
                          <label
                              htmlFor="created_at"
                              className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                          >
                            Created At
                          </label>
                          <input
                              type="text"
                              disabled
                              readOnly
                              name="created_at"
                              id="created_at"
                              className="w-full p-2.5 border border-gray-300 rounded-md text-sm disabled:opacity-60 disabled:bg-gray-100 dark:disabled:bg-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                              value={new Date(userDashboardData?.user.created_at).toLocaleDateString("en-CA")}
                          />
                        </div>
                      </div>

                      <button
                          type="submit"
                          className="mt-6 w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm sm:text-base font-medium"
                      >
                        Update User
                      </button>
                    </form>

                    {/* Appointments Section - Mobile Optimized */}
                    <div className="space-y-4">
                      <div className="border bg-green-200 dark:bg-green-900 text-green-700 dark:text-green-200 p-4 sm:p-5 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold">Total Appointments</h3>
                        <p className="text-xl sm:text-2xl font-semibold">{userDashboardData?.appointments.length}</p>
                      </div>

                      <div className="overflow-x-auto">
                        {userDashboardData?.appointments.length > 0 ? (
                            <>
                              {/* Mobile Card View */}
                              <div className="block lg:hidden space-y-4">
                                {userDashboardData.appointments.map((appointment, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg border shadow">
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    ID: {appointment.id}
                                  </span>
                                          <span
                                              className={`px-2 py-1 text-xs rounded-full ${
                                                  appointment.status === "pending"
                                                      ? "bg-yellow-100 text-yellow-800"
                                                      : appointment.status === "confirmed"
                                                          ? "bg-green-100 text-green-800"
                                                          : "bg-red-100 text-red-800"
                                              }`}
                                          >
                                    {appointment.status}
                                  </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1">
                                          <div>
                                            <span className="font-medium text-gray-500 dark:text-gray-400">User ID:</span>{" "}
                                            <span className="text-gray-900 dark:text-white">
                                      {appointment.user_id || "NULL"}
                                    </span>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-500 dark:text-gray-400">Doctor ID:</span>{" "}
                                            <span className="text-gray-900 dark:text-white">
                                      {appointment.doctor_id || "NULL"}
                                    </span>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-500 dark:text-gray-400">Type:</span>{" "}
                                            <span className="text-gray-900 dark:text-white">
                                      {appointment.appointment_type}
                                    </span>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-500 dark:text-gray-400">Date:</span>{" "}
                                            <span className="text-gray-900 dark:text-white">
                                      {appointment.appointment_date}
                                    </span>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-500 dark:text-gray-400">Time:</span>{" "}
                                            <span className="text-gray-900 dark:text-white">
                                      {appointment.appointment_time}
                                    </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                ))}
                              </div>

                              {/* Desktop Table View */}
                              <table className="hidden lg:table min-w-full border-collapse border border-gray-200 dark:border-gray-600">
                                <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                  <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                    ID
                                  </th>
                                  <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Status
                                  </th>
                                  <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                    User ID
                                  </th>
                                  <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Doctor ID
                                  </th>
                                  <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Type
                                  </th>
                                  <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Date
                                  </th>
                                  <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Time
                                  </th>
                                </tr>
                                </thead>
                                <tbody>
                                {userDashboardData.appointments.map((appointment, index) => (
                                    <tr
                                        key={index}
                                        className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                                    >
                                      <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                        {appointment.id}
                                      </td>
                                      <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                        {appointment.status}
                                      </td>
                                      <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                        {appointment.user_id || "NULL"}
                                      </td>
                                      <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                        {appointment.doctor_id || "NULL"}
                                      </td>
                                      <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                        {appointment.appointment_type}
                                      </td>
                                      <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                        {appointment.appointment_date}
                                      </td>
                                      <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                        {appointment.appointment_time}
                                      </td>
                                    </tr>
                                ))}
                                </tbody>
                              </table>
                            </>
                        ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 rounded-lg">
                              No Appointments Found
                            </div>
                        )}
                      </div>
                    </div>

                    {/* Reviews Section - Mobile Optimized */}
                    <div className="space-y-4">
                      <div className="border bg-yellow-200 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 p-4 sm:p-5 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold">Total Reviews</h3>
                        <p className="text-xl sm:text-2xl font-semibold">{userDashboardData?.reviews.length}</p>
                      </div>

                      {userDashboardData?.reviews.length > 0 ? (
                          <div className="overflow-x-auto">
                            {/* Mobile Card View */}
                            <div className="block lg:hidden space-y-4">
                              {userDashboardData.reviews.map((review, index) => (
                                  <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg border shadow">
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  Review ID: {review.id}
                                </span>
                                        <div className="flex items-center">
                                          <span className="text-yellow-400">{"★".repeat(review.rating)}</span>
                                          <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                                          <span className="ml-1 text-gray-600 dark:text-gray-400">({review.rating})</span>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-1 gap-1">
                                        <div>
                                          <span className="font-medium text-gray-500 dark:text-gray-400">User ID:</span>{" "}
                                          <span className="text-gray-900 dark:text-white">{review.user_id || "NULL"}</span>
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-500 dark:text-gray-400">Doctor ID:</span>{" "}
                                          <span className="text-gray-900 dark:text-white">{review.doctor_id || "NULL"}</span>
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-500 dark:text-gray-400">Comments:</span>{" "}
                                          <span className="text-gray-900 dark:text-white">{review.comments}</span>
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-500 dark:text-gray-400">Date:</span>{" "}
                                          <span className="text-gray-900 dark:text-white">
                                    {new Date(review.created_at).toLocaleDateString("en-CA")}
                                  </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                              ))}
                            </div>

                            {/* Desktop Table View */}
                            <table className="hidden lg:table min-w-full border-collapse border border-gray-200 dark:border-gray-600">
                              <thead>
                              <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                  ID
                                </th>
                                <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                  User ID
                                </th>
                                <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                  Doctor ID
                                </th>
                                <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                  Rating
                                </th>
                                <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                  Comments
                                </th>
                                <th className="border border-gray-200 dark:border-gray-600 p-2 text-sm font-medium text-gray-900 dark:text-white">
                                  Created At
                                </th>
                              </tr>
                              </thead>
                              <tbody>
                              {userDashboardData.reviews.map((review, index) => (
                                  <tr
                                      key={index}
                                      className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                                  >
                                    <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                      {review.id}
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                      {review.user_id || "NULL"}
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                      {review.doctor_id || "NULL"}
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                      <div className="flex items-center">
                                        <span className="text-yellow-400">{"★".repeat(review.rating)}</span>
                                        <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                                        <span className="ml-1">({review.rating})</span>
                                      </div>
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                      {review.comments}
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-600 p-2 text-sm text-gray-900 dark:text-white">
                                      {new Date(review.created_at).toLocaleDateString("en-CA")}
                                    </td>
                                  </tr>
                              ))}
                              </tbody>
                            </table>
                          </div>
                      ) : (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 rounded-lg">
                            No Reviews found
                          </div>
                      )}
                    </div>
                  </div>
                </section>
            )}
          </div>
        </div>
      </>
  )
}

export default UserDashboard
