import { useEffect, useState } from "react";
import { Footer, Header, UserNavSettings } from "../../Components";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import axiosClient from "../../AxiosClient";

import { Dialog } from 'primereact/dialog';
import { useNavigate } from "react-router";
import Chat from "../../Components/Chat";

const AppointmentPage = () => {
    const [user, setUser] = useState(null)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [appointments, setAppointments] = useState(null)
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const navigate = useNavigate()

    const fetchAppointments = async () => {
        try {
            setIsLoading(true)
            setError("")
            const res = await axiosClient.get('/appointments')
            console.log('res', res)
            if (res?.data) {
                setAppointments(res.data)
            } else {
                throw new Error()
            }
        } catch (error) {
            console.log('error fetching appointment: ', error)
            setError("Network error")
        } finally {
          setIsLoading(false)
        }
    
    }
    const fetchUser = async () => {
        try {
            setIsLoading(true)
            setError("")
            const res = await axiosClient.get('/user')
            if (res?.data) {
              setUser(res.data)
            } else {
              throw new Error()
            }
        } catch (error) {
            console.log('error fetching appointment: ', error)
            setError("Network error")            
        } finally {
          setIsLoading(false)
        }
    }

    useEffect(() => {
      fetchAppointments()
      fetchUser()
    }, [])


  return (
    <div>
      <Header />
      <div className="_container my-8 flex ">
        <UserNavSettings />
        <div className="w-[75%] pl-7">

      <Typography
        variant="h4"
        gutterBottom
      >
        My Appointments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>Doctor</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Time</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && 
                <TableRow>
                    <TableCell colSpan={5} align="center" className="h-40">
                        <CircularProgress />
                    </TableCell>
                </TableRow>
            }
            { (!isLoading && appointments && appointments.length>0)  
            ? appointments?.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.doctor.firstname} {appointment.doctor.lastname}</TableCell>
                <TableCell>{appointment.appointment_date}</TableCell>
                <TableCell>{appointment.appointment_time}</TableCell>
                <TableCell>
                  <span
                    style={{
                      color:
                        appointment.status === "confirmed"
                          ? "green"
                          : appointment.status === "pending"
                          ? "orange"
                          : "red",
                      fontWeight: "bold"
                    }}
                  >
                    {appointment.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={appointment.status === "cancelled"}
                      onClick={() => setSelectedAppointment(appointment)} // ✅ Store selected appointment
                    >
                      View
                    </Button>
                    <Dialog
                      header="Appointment Details"
                      visible={!!selectedAppointment}
                      maximized
                      style={{ width: "50vw" }}
                      onHide={() => setSelectedAppointment(null)}
                    >
                      {selectedAppointment && (
                        <div className="m-0 flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <h2 className="flex-1 text-left">Appointment Type:</h2>
                            <h2 className="flex-1 text-center">Appointment Fee</h2>
                            {/* <h2 className="flex-1 text-center">Chat</h2> */}
                            {selectedAppointment?.appointment_type === "video" && (
                              <h2 className="flex-1 text-center">Join Call</h2>
                            )}
                          </div>
                          <div className="flex items-center justify-between font-semibold">
                            <h2 className="flex-1 text-left">
                              {selectedAppointment?.appointment_type}
                            </h2>
                            <h2 className="flex-1 text-center">
                              {selectedAppointment?.appointment_type === "video"
                                ? selectedAppointment?.video_fee
                                : selectedAppointment?.clinic_fee}
                            </h2>
                            {selectedAppointment?.appointment_type === "video" && (
                              <span className="flex-1 flex items-center justify-center">
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  disabled={selectedAppointment?.status === "cancelled"}
                                  onClick={() => navigate(`/room/${selectedAppointment?.id}`, { state: { user } })}
                                >
                                  Join Call
                                </Button>
                              </span>
                            )}
                          </div>
                          <section className="mt-20 w-full">
                            <Chat appointmentId={selectedAppointment?.id} doctor_id={appointment?.doctor?.id} user_id={user?.id} from={'user'}  />
                          </section>
                        </div>
                      )}
                    </Dialog>
                  </span>
                </TableCell>
              </TableRow>
            ))
            : (!isLoading) &&
              (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="h-40">
                    <Typography>{ error ? error : "No Appointments Found"}</Typography>
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </div>
      <Footer />
    </div>
  )
}

export default AppointmentPage;
