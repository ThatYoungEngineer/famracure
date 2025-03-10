import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import axiosClient from "../../AxiosClient";
import { useParams } from 'react-router-dom';
import GetAuthAdmin from "../../hooks/GetAuthAdmin";
import { NavBarAdmin, SidebarAdmin } from "../../Components";

const DoctorDashboard = () => {
  document.title = "Payments";

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [doctorDashboardData, setDoctorDashboardData] = useState(null)

  const {id} = useParams()

  GetAuthAdmin()

  useEffect(() => {
    fetchDoctorDashboard()
  }, [id])

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

  return (
    <>
      <NavBarAdmin />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <SidebarAdmin />
        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
        >
            {isLoading && <div className="w-[85vw] h-screen flex items-center justify-center"> <Spinner size={'xl'} /> </div> }
            {error && <div className="text-red-500 text-center">{error}</div>}
            {doctorDashboardData &&
                <section className="w-full p-6 bg-white shadow-lg rounded-lg">
                    <h1 className="text-center text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Doctor Dashboard</h1>
                    
                    <div className="space-y-4">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-700">Doctor Details</h2>
                            <p className="text-gray-600"><span className="font-medium">ID:</span> {doctorDashboardData?.doctor.id || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">Name:</span> {doctorDashboardData?.doctor.firstname || "N/A"} {doctorDashboardData?.doctor.lastname || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">Email:</span> {doctorDashboardData?.doctor.email || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">About:</span> {doctorDashboardData?.doctor.about || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">Gender:</span> {doctorDashboardData?.doctor.gender || "N/A" || "Other"}</p>
                            <p className="text-gray-600"><span className="font-medium">Phone:</span> {doctorDashboardData?.doctor.phoneNumber || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">CIN:</span> {doctorDashboardData?.doctor.cin || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">Matricule:</span> {doctorDashboardData?.doctor.matricule || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">Speciality:</span> {doctorDashboardData?.doctor.specialite || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">Experience Years:</span> {doctorDashboardData?.doctor.experience_years || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">Experience Institute:</span> {doctorDashboardData?.doctor.experience_institute || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">Experience Start Date:</span> {doctorDashboardData?.doctor.experience_start_date || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">Experience End Date:</span> {doctorDashboardData?.doctor.experience_end_date || "N/A"}</p>
                             <p className="text-gray-600"><span className="font-medium">Experience Details:</span> {doctorDashboardData?.doctor.experience_detail || "N/A"}</p>
                            <p className="text-gray-600"><span className="font-medium">Verified:</span> {doctorDashboardData?.doctor.verified || "N/A" ? 'Yes' : 'No'}</p>
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