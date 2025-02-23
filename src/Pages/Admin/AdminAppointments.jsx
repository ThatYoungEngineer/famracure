import React from 'react'
import { NavBarAdmin, SidebarAdmin } from '../../Components'
import AdminAppointmentsContainer from '../../Components/Admin/Appointments/AdminAppointmentsContainer'

const AdminAppointments = () => {
  return (
    <>
      <NavBarAdmin />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <SidebarAdmin />
        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
        >
          <AdminAppointmentsContainer />
        </div>
      </div>
    </>
  )


  
}

export default AdminAppointments