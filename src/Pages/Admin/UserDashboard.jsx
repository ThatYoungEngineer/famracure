import { useEffect, useState } from 'react'
import axiosClient from '../../AxiosClient'
import { NavBarAdmin, SidebarAdmin } from '../../Components'
import { useParams } from 'react-router'
import { Spinner } from 'flowbite-react'

const UserDashboard = () => {

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [updatedFields, setUpdatedFields] = useState({});
  const [userDashboardData, setUserDashboardData] = useState(null)

   const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(userDashboardData?.user.user_avatar);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file)); // Show preview
    }
  };

  const { id } = useParams()

  useEffect(() => {
    fetchUserDashboard()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedFields((prev) => ({
      ...prev,
      [name]: value,  // Track only the changed field
    }));
  };

  const fetchUserDashboard = async () => {
    setUserDashboardData(null)
    setError(null)
    setIsLoading(true)
    try {
      const response = await axiosClient.get(`admin/user-dashboard/${id}`);
      if (response.status === 200) {
        setUserDashboardData(response.data);
        setUpdatedFields(response.data.user); // Correctly initialize updatedFields
      }

    } catch (error) {
      setError(error.response.data.message)
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();

    if (Object.keys(updatedFields).length === 0) {
      console.log("No changes detected");
      return;
    }

    const formData = new FormData();

    Object.entries(updatedFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (selectedAvatar) {
      formData.append("user_avatar", selectedAvatar);
    }

    try {
      const response = await axiosClient.put(`/user/dashboard/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("User updated successfully:", response.data);

      // Reset state after successful update
      setUpdatedFields({});
    } catch (error) {
      console.error("Error updating user:", error);
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
          {isLoading && <div className="w-[85vw] h-screen flex items-center justify-center"> <Spinner size={'xl'} /> </div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
          {userDashboardData &&
            <section className="w-full p-6 bg-white shadow-lg rounded-lg">
              <h1 className="text-center text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">User Dashboard</h1>

              <div className="space-y-4">
                <form className="bg-gray-100 p-4 rounded-lg" onSubmit={handleUserUpdate}>
                  <h2 className="text-xl font-semibold text-gray-700">User Details</h2>
                  <p className="text-gray-600"><span className="font-medium">User ID:</span> {userDashboardData?.user.id || "N/A"}</p>
                  <div className='flex flex-col gap-1 items-center justify-center'>
                    <label htmlFor="user_avatar">User Avatar</label>
                    <img src={previewAvatar} name="user_avatar" id='user_avatar' alt="profile_picture" className='w-40 h-40 rounded-md border bg-gray-300' />
                    <input type="file" name="user_avatar" id="user_avatar" accept="image/*" onChange={handleAvatarChange} className="mt-2" />
                  </div>
                  <div>
                    <label htmlFor="firstname">First Name</label>
                    <input 
                      type="text" name='firstname' id='firstname' className='w-full p-2 border rounded-md' 
                      value={updatedFields.firstname ?? userDashboardData?.user.firstname ?? ""}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div>
                    <label htmlFor="lastname">Last Name</label>
                    <input 
                      type="text" name='lastname' id='lastname' className='w-full p-2 border rounded-md'
                      value={updatedFields.lastname ?? userDashboardData?.user.lastname ?? ""}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input 
                      type="text" name='email' id='email' className='w-full p-2 border rounded-md' 
                      value={updatedFields.email ?? userDashboardData?.user.email ?? ""}
                      onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="gender">Gender</label>
                    <select
                      name="gender"
                      id="gender"
                      value={updatedFields.gender ?? userDashboardData?.user.gender ?? ""}
                      className='w-full p-2 border rounded-md'
                      onChange={handleInputChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="transgender">Transgender</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="phone_number">Phone Number</label>
                    <input 
                      type="text" name='phone_number' id='phone_number' className='w-full p-2 border rounded-md' 
                      value={updatedFields.phone_number ?? userDashboardData?.user.phone_number ?? ""}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div>
                    <label htmlFor="country_code">Country Code</label>
                    <select
                      name="country_code"
                      id="country_code"
                      className='w-full p-2 border-2 rounded-md'
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
                  <div>
                    <label htmlFor="cin">CIN</label>
                    <input 
                      type="text" name='cin' id='cin' className='w-full p-2 border rounded-md' 
                      value={updatedFields.cin ?? userDashboardData?.user.cin ?? ""}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div>
                    <label htmlFor="email_verified_at">Email Verified At</label>
                    <input 
                      type="date" name='email_verified_at' id='email_verified_at' className='w-full p-2 border rounded-md'
                      value={updatedFields.email_verified_at ?? (userDashboardData?.user.email_verified_at ? new Date(userDashboardData.user.email_verified_at).toISOString().split('T')[0] : "")}
                      onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="created_at">Created At</label>
                    <input 
                      type="date" name='created_at' id='created_at' className='w-full p-2 border rounded-md' 
                      value={updatedFields.created_at ?? (userDashboardData?.user.created_at ? new Date(userDashboardData.user.created_at).toISOString().split('T')[0] : "")}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <button type='submit' className='mt-5 w-fit px-5 py-3 bg-green-200 text-green-700 rounded-lg focus:outline'>
                    Update User
                  </button>
                </form>
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