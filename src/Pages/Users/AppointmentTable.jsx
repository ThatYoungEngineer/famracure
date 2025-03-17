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
    const [rescheduleDialogue, setRescheduleDialogue] = useState(null);

    const [rescheduleDate, setRescheduleDate] = useState(null)
    const [rescheduleTime, setRescheduleTime] = useState(null)

    const [rescheduleSuccess, setRescheduleSuccess] = useState(null)

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

    const today = new Date();

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7); // Add 7 days to the current date

    // Format the max date as YYYY-MM-DD (required for the input's max attribute)
    const maxDateFormatted = maxDate.toISOString().split("T")[0];

    const handleTimeChange = (e) => {
      let [hours, minutes] = e.target.value.split(":").map(Number);
      minutes = Math.round(minutes / 15) * 15;
      if (minutes === 60) {
        minutes = 0;
        hours += 1;
      }
      const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      setRescheduleTime(formattedTime)
    };


  const handleRescheduleForm = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      setError("")
      const res = await axiosClient.post(`appointments/${rescheduleDialogue}/request-reschedule`, 
        {
          new_date: rescheduleDate,
          new_time: rescheduleTime
        } 
      )
      setRescheduleSuccess(res?.data?.message)
    } catch (error) {
      console.log('error fetching appointment: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  console.log('appointment id', rescheduleDialogue)


  return (
    <div className="w-screen h-screen">
    {rescheduleDialogue && 
      <section className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-800 bg-opacity-95 z-50">
        <div className="w-3/5 h-2/5 bg-white bg-opacity-90 rounded-md flex flex-col items-center p-5">
          <div className="w-full flex justify-end"> 
            <button
              type="button" 
              className="cursor-pointer w-7 h-7 rounded-full bg-red-500 text-black flex items-center justify-center"
              onClick={() => setRescheduleDialogue(null)}
            >
              X
            </button>
          </div>
          <span className="text-xl text-center" >You can reschedule your appointment upto one week from now</span>
          <form className="w-full flex flex-col items-center justify-center" onSubmit={handleRescheduleForm} >
            <div className="my-5 w-full flex flex-col gap-1 items-center justify-center">
              <label htmlFor="dateAppointment" className="block w-fit mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Appointment Date
              </label>
              <input 
                type="date"
                id="dateAppointment"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-2/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min={new Date().toISOString().split("T")[0]} // Disables past dates
                max={maxDateFormatted} // Disables dates beyond 7 days from now

                value={rescheduleDate} 
                onChange={(e) => setRescheduleDate(e.target.value) } 
                required 
              />
            </div>
            <div className="my-5 w-full flex flex-col gap-1 items-center justify-center">
              <label htmlFor="timeAppointment" className="block w-fit mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Appointment Time
              </label>
              <input 
                type="time"
                id="timeAppointment"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-2/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={handleTimeChange}
                value={rescheduleTime}
                step="900" 
              />
            </div>
            <Button            
              variant="contained"
              color="primary"
              size="small"
              type="submit"
            >
              Reschedule
            </Button>
            {rescheduleSuccess && <p className="w-full py-3 text-green-600 text-center">{rescheduleSuccess}</p>}
          </form>
        </div>
      </section>
    }

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
                  <div>
                    <span className="flex gap-1 items-center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={appointment.status === "cancelled"}
                        onClick={() => setSelectedAppointment(appointment)} // ✅ Store selected appointment
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        // disabled={appointment.status === "cancelled"}                      
                        onClick={() => setRescheduleDialogue(appointment.id)}
                      >
                        Reschedule
                      </Button>
                    </span>
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
                  </div>
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
