import { useState } from 'react'
import axiosClient from '../../AxiosClient'
import { NavBarAdmin, SidebarAdmin } from '../../Components'

const UserDashboard = () => {

  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userDashboardData, setUserDashboardData] = useState(null)

  const fetchUserDashboard = async () => {
    setUserDashboardData(null)
    setError(null)
    setIsLoading(true)
    try {
      const response = await axiosClient.get(`admin/user-dashboard/${userId}`);
      if (response.status === 200) {
        setUserDashboardData(response.data);
      }

    } catch (error) {
      setError(error.response.data.message)
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  };

  console.log('user DashboardData response: ', userDashboardData)

  return (
    <>
      <NavBarAdmin />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <SidebarAdmin />
        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
        >
          <section className="w-full p-5 flex flex-col gap-1">
            <h1>Fetch doctor by id</h1>
            <input
              type="number"
              placeholder="Enter user id"
              value={userId} onChange={e => setUserId(e.target.value)}
              className="w-full rounded-md border p-5"
            />
            <button
              type="button"
              className="p-3 bg-blue-500 text-white rounded-md disabled:opacity-50"
              disabled={isLoading}
              onClick={fetchUserDashboard}
            >
              {isLoading ? "Loading..." : "Fetch"}
            </button>
          </section>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {userDashboardData && 
            <section className="w-full p-6 bg-white shadow-lg rounded-lg">
              <h1 className="text-center text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">User Dashboard</h1>

              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-700">User Details</h2>
                  <p className="text-gray-600"><span className="font-medium">ID:</span> {userDashboardData?.user.id}</p>
                  <p className="text-gray-600"><span className="font-medium">Name:</span> {userDashboardData?.user.firstname} {userDashboardData?.user.lastname}</p>
                  <p className="text-gray-600"><span className="font-medium">Email:</span> {userDashboardData?.user.email}</p>
                  <p className="text-gray-600"><span className="font-medium">Gender:</span> {userDashboardData?.user.gender || "Other"}</p>
                  <p className="text-gray-600"><span className="font-medium">Phone:</span> {userDashboardData?.user.phone_number}</p>
                  <p className="text-gray-600"><span className="font-medium">CIN:</span> {userDashboardData?.user.cin}</p>
                  <p className="text-gray-600"><span className="font-medium">Created At:</span> {userDashboardData?.user.created_at}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="my-5 border bg-green-200 text-green-700 p-5 rounded-md flex flex-col items-center justify-center gap-2">
                  <h3 className="text-lg font-semibold">Total Appointments</h3>
                  <p className="text-2xl font-semibold">{userDashboardData?.appointments.length}</p>
                </div>
                {userDashboardData?.appointments.length > 0 ?
                  userDashboardData?.appointments.map((appointment, index) => (
                    <div key={index} className="flex gap-10">
                      <div className="flex gap-2">
                        <p className="font-semibold">ID:</p>
                        <p>{appointment.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <p className="font-semibold">Status:</p>
                        <p>{appointment.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <p className="font-semibold">User ID:</p>
                        <p>{appointment.user_id || 'NULL'}</p>
                      </div>
                      <div className="flex gap-2">
                        <p className="font-semibold">Doctor ID:</p>
                        <p>{appointment.doctor_id || 'NULL'}</p>
                      </div>
                      <div className="flex gap-2">
                        <p className="font-semibold">Appointment Type:</p>
                        <p>{appointment.appointment_type}</p>
                      </div>
                      <div className="flex gap-2">
                        <p className="font-semibold">Appointment Date:</p>
                        <p>{appointment.appointment_date}</p>
                      </div>
                      <div className="flex gap-2">
                        <p className="font-semibold">Appointment Time:</p>
                        <p>{appointment.appointment_time}</p>
                      </div>
                    </div>
                  ))
                  : <div>
                    No Appointments Found
                  </div>
                }
              </div>
              <div className="space-y-4">
                <div className="my-10 border bg-yellow-200 text-yellow-700 p-5 rounded-md flex flex-col items-center justify-center gap-2">
                  <h3 className="text-lg font-semibold">Total Reviews</h3>
                  <p className="text-2xl font-semibold">{userDashboardData?.reviews.length}</p>
                </div>
                {userDashboardData?.reviews.length === 0 && <div >No Reviews Found</div>}
              </div>
            </section>
          }
        </div>
      </div>
    </>
  )
}

export default UserDashboard