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
  useMediaQuery,
  useTheme,
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

  const [invoiceError, setInvoiceError] = useState(null)

  const navigate = useNavigate()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
  maxDate.setDate(today.getDate() + 7);
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

  const generateInvoice = (id) => {
    setInvoiceError(null)
    axiosClient
      .post(`/appointments/${id}/generate-invoice`)
      .then((res) => {
        console.log('response', res)
      })
      .catch((err) =>
        setInvoiceError(err?.response?.data?.error)
      )
  }

  const downloadInvoice = (id) => {
    setInvoiceError(null)
    axiosClient
      .get(`/appointments/${id}/invoice`, { responseType: "blob" })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.log('err download: ', err)
        err?.response?.data && setInvoiceError("Invoice not found")
      })
  }

  return (
    <div className="w-screen min-h-screen flex flex-col">
      {rescheduleDialogue &&
        <section className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-800 bg-opacity-95 z-50">
          <div className={`${isMobile ? 'w-11/12' : isTablet ? 'w-4/5' : 'w-3/5'} ${isMobile ? 'h-2/3' : 'h-2/5'} bg-white bg-opacity-90 rounded-md flex flex-col items-center p-5 overflow-y-auto`}>
            <div className="w-full flex justify-end">
              <button
                type="button"
                className="cursor-pointer w-7 h-7 rounded-full bg-red-500 text-black flex items-center justify-center"
                onClick={() => setRescheduleDialogue(null)}
              >
                X
              </button>
            </div>
            <span className="text-lg md:text-xl text-center">You can reschedule your appointment upto one week from now</span>
            <span className="text-xs md:text-sm mt-2 text-yellow-500 text-center">* It will be as per the doctor availability</span>
            <form className="w-full flex flex-col items-center justify-center" onSubmit={handleRescheduleForm}>
              <div className="my-3 md:my-5 w-full flex flex-col gap-1 items-center justify-center">
                <label htmlFor="dateAppointment" className="block w-fit mb-1 md:mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Appointment Date
                </label>
                <input
                  type="date"
                  id="dateAppointment"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-4/5 md:w-2/5 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min={new Date().toISOString().split("T")[0]}
                  max={maxDateFormatted}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  required
                />
              </div>
              <div className="my-3 md:my-5 w-full flex flex-col gap-1 items-center justify-center">
                <label htmlFor="timeAppointment" className="block w-fit mb-1 md:mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Appointment Time
                </label>
                <input
                  type="time"
                  id="timeAppointment"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-4/5 md:w-2/5 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={handleTimeChange}
                  value={rescheduleTime}
                  step="900"
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                size={isMobile ? "small" : "medium"}
                type="submit"
                className="w-1/2 md:w-auto"
              >
                Reschedule
              </Button>
              {rescheduleSuccess && <p className="w-full py-2 md:py-3 text-green-600 text-center text-sm md:text-base">{rescheduleSuccess}</p>}
            </form>
          </div>
        </section>
      }

      <Header />
      <div className="_container my-4 md:my-8 flex flex-col md:flex-row">
        <UserNavSettings />
        <div className={`${isMobile ? 'w-full' : 'w-[75%]'} ${isMobile ? 'px-2' : 'pl-7'} mt-4 md:mt-0`}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            className={isMobile ? "text-center" : ""}
          >
            My Appointments
          </Typography>
          
          {isMobile ? (
            // Mobile view - Card layout
            <div className="space-y-4">
              {isLoading && (
                <div className="flex justify-center items-center h-40">
                  <CircularProgress />
                </div>
              )}
              
              {(!isLoading && appointments && appointments.length > 0) ? (
                appointments.map((appointment) => (
                  <Paper key={appointment.id} className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <Typography variant="subtitle1">
                        <b>Doctor:</b> {appointment.doctor.firstname} {appointment.doctor.lastname}
                      </Typography>
                    </div>
                    <Typography variant="body2">
                      <b>Date:</b> {appointment.appointment_date}
                    </Typography>
                    <Typography variant="body2">
                      <b>Time:</b> {appointment.appointment_time}
                    </Typography>
                    <Typography variant="body2">
                      <b>Status:</b> 
                      <span style={{
                        color: appointment.status === "confirmed" ? "green" :
                               appointment.status === "pending" ? "orange" : "red",
                        fontWeight: "bold",
                        marginLeft: "5px"
                      }}>
                        {appointment.status}
                      </span>
                    </Typography>
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={appointment.status === "cancelled"}
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => setRescheduleDialogue(appointment.id)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </Paper>
                ))
              ) : (!isLoading) && (
                <div className="flex justify-center items-center h-40">
                  <Typography>{error ? error : "No Appointments Found"}</Typography>
                </div>
              )}
            </div>
          ) : (
            // Tablet and Desktop view - Table layout
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
                  {(!isLoading && appointments && appointments.length > 0)
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
                                onClick={() => setSelectedAppointment(appointment)}
                              >
                                View
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => setRescheduleDialogue(appointment.id)}
                              >
                                Reschedule
                              </Button>
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                    : (!isLoading) &&
                    (
                      <TableRow>
                        <TableCell colSpan={5} align="center" className="h-40">
                          <Typography>{error ? error : "No Appointments Found"}</Typography>
                        </TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Dialog for appointment details (common for all screen sizes) */}
          <Dialog
            header={selectedAppointment ? `Appointment with Dr. ${selectedAppointment.doctor.firstname} ${selectedAppointment.doctor.lastname}` : ''}
            visible={!!selectedAppointment}
            maximized={isMobile}
            style={{ width: isMobile ? "90vw" : "50vw" }}
            onHide={() => setSelectedAppointment(null)}
          >
            {selectedAppointment && (
              <div className="m-0 flex flex-col gap-1 bg-gray-50 py-5">
                <div className="w-full flex flex-col items-center justify-center space-y-2">
                  <Button
                    variant="contained"
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    onClick={(e) => generateInvoice(selectedAppointment.id)}
                    className="w-4/5 md:w-fit p-2"
                  >
                    Generate Invoice
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    onClick={(e) => downloadInvoice(selectedAppointment.id)}
                    className="w-4/5 md:w-fit p-2"
                  >
                    Download Invoice
                  </Button>
                  {invoiceError && <p className="w-full text-center text-red-500 text-sm md:text-base">{invoiceError}</p>}
                </div>
                <div className={`${isMobile ? 'flex-col' : 'flex'} items-center justify-between mt-5 md:mt-10 px-2 md:px-0`}>
                  <h2 className={`${isMobile ? 'w-full mb-2' : 'flex-1'} text-left text-sm md:text-base`}>Appointment Type:</h2>
                  <h2 className={`${isMobile ? 'w-full mb-2' : 'flex-1'} text-left text-sm md:text-base`}>Status:</h2>
                  <h2 className={`${isMobile ? 'w-full mb-2' : 'flex-1'} text-center text-sm md:text-base`}>Appointment Fee</h2>
                  {selectedAppointment?.appointment_type === "video" && (
                    <h2 className={`${isMobile ? 'w-full' : 'flex-1'} text-center text-sm md:text-base`}>Join Call</h2>
                  )}
                </div>
                <div className={`${isMobile ? 'flex-col' : 'flex'} items-center justify-between font-semibold px-2 md:px-0`}>
                  <h2 className={`${isMobile ? 'w-full mb-2' : 'flex-1'} text-left text-sm md:text-base`}>
                    {selectedAppointment?.appointment_type}
                  </h2>
                  <h2 className={`${isMobile ? 'w-full mb-2' : 'flex-1'} text-left text-sm md:text-base`}>
                    <span
                      style={{
                        color: selectedAppointment.status === "confirmed" ? "green" :
                               selectedAppointment.status === "pending" ? "orange" : "red",
                        fontWeight: "bold"
                      }}
                    >
                      {selectedAppointment.status}
                    </span>
                  </h2>
                  <h2 className={`${isMobile ? 'w-full mb-2' : 'flex-1'} text-center text-sm md:text-base`}>
                    {selectedAppointment?.appointment_type === "video"
                      ? selectedAppointment?.video_fee
                      : selectedAppointment?.clinic_fee}
                  </h2>
                  {selectedAppointment?.appointment_type === "video" && (
                    <span className={`${isMobile ? 'w-full' : 'flex-1'} flex items-center justify-center`}>
                      <Button
                        variant="contained"
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        disabled={selectedAppointment?.status === "cancelled"}
                        onClick={() => navigate(`/room/${selectedAppointment?.id}`, { state: { user } })}
                        className={isMobile ? "w-full" : ""}
                      >
                        Join Call
                      </Button>
                    </span>
                  )}
                </div>
                <section className="mt-10 md:mt-20 w-full px-2 md:px-0">
                  <Chat 
                    appointmentId={selectedAppointment?.id} 
                    doctor_id={selectedAppointment?.doctor?.id} 
                    user_id={user?.id} 
                    from={'user'} 
                    isMobile={isMobile}
                  />
                </section>
              </div>
            )}
          </Dialog>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AppointmentPage;