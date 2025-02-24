import React from 'react';
import TopBar from '../Components/TopBar';
import { Footer } from '../Components';

const ForgotPassword = () => {
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
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
                    <input type="email" required placeholder='Enter your email' className='w-full px-5 py-2 border border-gray-400 rounded-md' />
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

export default ForgotPassword;
