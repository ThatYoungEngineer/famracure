import { useEffect } from 'react'
import Calendar from 'react-calendar'
import React, { useState } from 'react'
import { Spinner } from 'flowbite-react'
import 'react-calendar/dist/Calendar.css'
import axiosClient from '../../../AxiosClient'


const DoctorDashboardStats = () => {

    const [earnings, setEarnings] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [appointments, setAppointments] = useState(null)
    
    const [calendarAppointments, setCalendarAppointments] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        axiosClient
            .get(`/appointments`)
            .then((res) => {
            if (res.status === 200) {
                setAppointments(res.data);
                // setCalendarAppointments(appointments.filter(appoint => appoint))
            }
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false))

    }, [])

    useEffect(() => {
        setIsLoading(true)
        axiosClient
            .get('/doctor/earnings')
            .then((res) => {
                setEarnings(res.data)
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false))

    }, [])

  return (
    <div className='p-4 flex flex-col gap-10' >
        <main className='p-4 flex items-center gap-10'>
            <section className='flex-1 flex items-center justify-center flex-col gap-2 text-lg text-green-700 bg-green-100 w-fit px-10 py-6 rounded-lg'>
                {isLoading ? 
                    <Spinner size="lg" />
                    :
                    <>
                        <h2> Total Appointments </h2>
                        <p> {appointments?.length} </p>
                    </>
                }
                
            </section>
            <section className='flex-1 flex items-center justify-center flex-col gap-2 text-lg text-yellow-700 bg-yellow-100 w-fit px-10 py-6 rounded-lg'>
                {isLoading ? 
                    <Spinner size="lg" />
                    :
                    <>
                        <h2> Total Earnings </h2>
                        <p> {earnings && earnings[0] ? earnings : 0} </p>
                    </>
                }
            </section>
            <section className='flex-1 flex items-center justify-center flex-col gap-2 text-lg text-red-700 bg-red-100 w-fit px-10 py-6 rounded-lg'>
                {isLoading ? 
                    <Spinner size="lg" />
                    :
                    <>
                        <h2> Pending Appointments </h2>
                        <p> {appointments?.filter((e) => e.status == "pending")?.length } </p>
                    </>
                }
            </section>
        </main>
        <div className='p-10 flex flex-col gap-2 items-center'>
            <h1 className='text-2xl'>See all of your appointments here..</h1>
            <Calendar value={new Date()} />
        </div>
    </div>
  )
}

export default DoctorDashboardStats