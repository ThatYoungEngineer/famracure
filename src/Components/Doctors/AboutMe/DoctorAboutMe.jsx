import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { Spinner } from 'flowbite-react'
import axiosClient from '../../../AxiosClient'

const DoctorAboutMe = () => {
    const [aboutMe, setAboutMe] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({success: "", error: ""})


console.log("aboutMe: ", aboutMe)
    useEffect(() => {
        getAboutMe()
    }, [])
    const getAboutMe = () => {
        setIsLoading(true)
        try {
            axiosClient
            .get('/doctor/about')
            .then((response) => {
                setAboutMe(response.data.about_doctor)
            })   
        } catch (error) {
            console.log("error: ", error)
        } finally {
            setIsLoading(false)
        }
    }
    const postAboutMe = () => {
        setIsLoading(true)
        try {
            axiosClient
            .post('/doctor/about', { about_doctor: aboutMe })
            .then((response) => {
                setMessage({success: response.data.message, error: ""})
            })
        } catch (error) {
            setMessage({success: "", error: error.response.data.message})
        } finally {
            setIsLoading(false)
        }

    }

  return (
    <main className='p-5 flex flex-col gap-10'>
        <h1 className='text-4xl text-center'>Tell Patients About Yourself</h1>
        <section className='flex flex-col gap-5'>
            <textarea 
                name="about" id="about" 
                placeholder='Write about yourself..'
                className='resize-y w-full rounded-lg border-indigo-500'
                rows={7}
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                disabled={isLoading}
            />
            <div className='w-full flex items-center justify-end gap-3'>
                <Button
                    type='button'
                    onClick={postAboutMe}
                    variant='contained'
                    color='primary'
                    disabled={isLoading}
                    size='large'
                >
                    {isLoading && <Spinner size='sm' className='mr-2' color="info" /> } Submit
                </Button>
            </div>
            {message.success && <p className='text-green-500'>{message.success}</p>}
            {message.error && <p className='text-red-500'>{message.error}</p>}
        </section>
    </main>
  )
}

export default DoctorAboutMe