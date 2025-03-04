import { useState } from 'react';
import { Footer } from '../Components';
import axiosClient from '../AxiosClient';
import TopBar from '../Components/TopBar';

const DoctorForgotPassword = () => {
    const [email, setEmail] = useState('')
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        axiosClient
        .post("forgot-password/doctor", {email})
        .then((res) => {
            console.log(res)
        })
        
    }


  return (
    <main className='h-screen flex flex-col justify-between overflow-hidden'>
        <div className='flex-1 max-h-fit'> <TopBar /> </div>
        <div className="flex-1 max-h-fit">
            <h1 className="mt-4 text-center w-full text-[25px] font-medium text-[#587FD9]">
                Forgot Password? Reset here.
            </h1>
        </div>
        <div className='flex-1 flex items-center justify-center flex-col my-20 px-4'>
            <div className='flex flex-col bg-gray-200 w-[40rem] h-[20rem] rounded-xl p-10'>
                <h2 className='text-center text-xl'>Enter your email here</h2>
                <form className='flex flex-col gap-5 my-auto' onSubmit={handleFormSubmit}>
                    <input 
                        required 
                        type="email" 
                        placeholder='Enter your email' 
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full px-5 py-2 border border-gray-400 rounded-md' 
                        />
                    <button
                        type='submit'
                        className='px-5 w-fit mx-auto py-2 rounded-md text-white bg-[#587FD9]'
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
        <div className='flex-1'> <Footer /> </div>
    </main>
  );
};

export default DoctorForgotPassword;
