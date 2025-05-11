import { useEffect } from 'react'
import React, { useState } from 'react'
import { Spinner } from 'flowbite-react'
import 'react-calendar/dist/Calendar.css'
import axiosClient from '../../../AxiosClient'
import { useSelector } from 'react-redux'

const DoctorDashboardStats = () => {
    const doctorData = useSelector((state) => state.AuthDoctor);
    const [earnings, setEarnings] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [appointments, setAppointments] = useState(null)
    
    useEffect(() => {
        setIsLoading(true)
        axiosClient
            .get(`/appointments`)
            .then((res) => {
                if (res.status === 200) {
                    setAppointments(res.data);
                }
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        setIsLoading(true)
        axiosClient
            .get(`/doctors/${doctorData.doctor.id}/earnings`)
            .then((res) => {
                console.log('doctor earnings', res.data.data.total_earnings)
                setEarnings(res.data.data.total_earnings)
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <div className='p-4'>
            <main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {/* Total Appointments Card */}
                <section className='flex flex-col items-center justify-center gap-2 text-lg text-green-700 bg-green-100 p-6 rounded-lg'>
                    {isLoading ? 
                        <Spinner size="lg" />
                        :
                        <>
                            <h2 className='text-center'>Total Appointments</h2>
                            <p className='text-2xl font-semibold'>{appointments?.length}</p>
                        </>
                    }
                </section>
                
                {/* Total Earnings Card */}
                <section className='flex flex-col items-center justify-center gap-2 text-lg text-yellow-700 bg-yellow-100 p-6 rounded-lg'>
                    {isLoading ? 
                        <Spinner size="lg" />
                        :
                        <>
                            <h2 className='text-center'>Total Earnings</h2>
                            <p className='text-2xl font-semibold'>{earnings ? earnings : 0}</p>
                        </>
                    }
                </section>
                
                {/* Pending Appointments Card */}
                <section className='flex flex-col items-center justify-center gap-2 text-lg text-red-700 bg-red-100 p-6 rounded-lg'>
                    {isLoading ? 
                        <Spinner size="lg" />
                        :
                        <>
                            <h2 className='text-center'>Pending Appointments</h2>
                            <p className='text-2xl font-semibold'>
                                {appointments?.filter((e) => e.status === "pending")?.length}
                            </p>
                        </>
                    }
                </section>
            </main>
        </div>
    )
}

export default DoctorDashboardStats