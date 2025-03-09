import { useEffect, useState } from "react";
import { NavBarAdmin, SidebarAdmin } from "../../Components";
import GetAuthAdmin from "../../hooks/GetAuthAdmin";
import axiosClient from "../../AxiosClient";

const DoctorDashboard = () => {
  document.title = "Payments";

  const [error, setError] = useState(null)
  const [doctorId, setDoctorId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [doctorDashboardData, setDoctorDashboardData] = useState(null)

  GetAuthAdmin()

    const fetchDoctorDashboard = async () => {
        setDoctorDashboardData(null)
        setError(null)
        setIsLoading(true)
        try {
        const response = await axiosClient.get(`admin/doctor-dashboard/${doctorId}`);
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

    console.log('doctorDashboardData: ', doctorDashboardData)

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
                    placeholder="Enter doctor id" 
                    value={doctorId} onChange={e=>setDoctorId(e.target.value)}
                    className="w-full rounded-md border p-5"
                />
                <button 
                    type="button"
                    className="p-3 bg-blue-500 text-white rounded-md disabled:opacity-50"
                    disabled={isLoading}
                    onClick={fetchDoctorDashboard}
                >
                    {isLoading ? "Loading..." : "Fetch"}
                </button>
            </section>
            {error && <div className="text-red-500 text-center">{error}</div>}
            {doctorDashboardData &&
                <section className="w-full p-6 bg-white shadow-lg rounded-lg">
                    <h1 className="text-center text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Doctor Dashboard</h1>
                    
                    <div className="space-y-4">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-700">Doctor Details</h2>
                            <p className="text-gray-600"><span className="font-medium">ID:</span> {doctorDashboardData?.doctor.id}</p>
                            <p className="text-gray-600"><span className="font-medium">Name:</span> {doctorDashboardData?.doctor.firstname} {doctorDashboardData?.doctor.lastname}</p>
                            <p className="text-gray-600"><span className="font-medium">Email:</span> {doctorDashboardData?.doctor.email}</p>
                            <p className="text-gray-600"><span className="font-medium">About:</span> {doctorDashboardData?.doctor.about}</p>
                            <p className="text-gray-600"><span className="font-medium">Gender:</span> {doctorDashboardData?.doctor.gender || "Other"}</p>
                            <p className="text-gray-600"><span className="font-medium">Phone:</span> {doctorDashboardData?.doctor.phoneNumber}</p>
                            <p className="text-gray-600"><span className="font-medium">CIN:</span> {doctorDashboardData?.doctor.cin}</p>
                            <p className="text-gray-600"><span className="font-medium">Matricule:</span> {doctorDashboardData?.doctor.matricule}</p>
                            <p className="text-gray-600"><span className="font-medium">Speciality:</span> {doctorDashboardData?.doctor.specialite}</p>
                            <p className="text-gray-600"><span className="font-medium">Verified:</span> {doctorDashboardData?.doctor.verified ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="my-5 border bg-green-200 text-green-700 p-5 rounded-md flex flex-col items-center justify-center gap-2">
                            <h3 className="text-lg font-semibold">Total Appointments</h3>
                            <p className="text-2xl font-semibold">{doctorDashboardData?.appointments.length}</p>
                        </div>
                        {doctorDashboardData?.appointments.length > 0 ? 
                            doctorDashboardData?.appointments.map((appointment, index) => (
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
                            No Appointments found
                        </div>
                        }
                    </div>
                    <div className="space-y-4">
                        <div className="my-10 border bg-yellow-200 text-yellow-700 p-5 rounded-md flex flex-col items-center justify-center gap-2">
                            <h3 className="text-lg font-semibold">Total Reviews</h3>
                            <p className="text-2xl font-semibold">{doctorDashboardData?.reviews.length}</p>
                        </div>
                        {doctorDashboardData?.reviews.length === 0 && <div >No Reviews Found</div>}
                    </div>
                </section>
            }
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard