import React, { useState } from 'react';
import TopBar from '../Components/TopBar';
import { Footer } from '../Components';
import axiosClient from '../AxiosClient';
import { useEffect } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [resetToken, setResetToken] = useState(null)
    const [resetEmail, setResetEmail] = useState(null)

    const [error, setError] = useState(null)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState(null)


    useEffect(() => {
        // Get the query string from the URL
        const queryString = window.location.search;

        // Create a URLSearchParams object to parse the query string
        const urlParams = new URLSearchParams(queryString);

        // Extract the token and email
        const token = urlParams.get("token");
        const email = urlParams.get("email");
        if (token && email) {
            const decodedEmail = decodeURIComponent(email);
            setResetToken(token)
            setResetEmail(decodedEmail)
        }

    }, [])

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)
        setMessage('')
        axiosClient
        .post("forgot-password/user", {email})
        .then((res) => {
            alert(res?.data?.message)
            console.log('res: ', res?.data?.message)
        })
        .catch((error) => {
            const errorMessage = error.response.data.message
            setMessage(errorMessage)
        })
        .finally(() => {
            setIsLoading(false)
        });   
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setIsLoading(true);
        try {
            axiosClient
            .post("reset-password/user", 
                { 
                email: resetEmail, token: resetToken, password: password, password_confirmation: confirmPassword 
                }
            )
            .then((res) => {
                setError(res.data.message)
            })
            .finally(() => {
                setIsLoading(false)
            })
        } catch (error) {
            console.log("error", error);
        } 
    }

    console.log('loading: ', isLoading);


  return (
    <main className='min-h-screen flex flex-col justify-between overflow-x-hidden'>
        <div className='flex-1 max-h-fit'> <TopBar /> </div>
        <div className="flex-1 max-h-fit">
            <h1 className="mt-4 text-center w-full text-xl md:text-[25px] font-medium text-[#587FD9]">
                Forgot Password? Reset here.
            </h1>
        </div>
        <div className='flex-1 flex items-center justify-center flex-col my-8 md:my-20 px-4'>
            <div className='flex flex-col bg-gray-200 w-full max-w-[40rem] min-h-[20rem] rounded-xl p-4 md:p-10'>

                {resetToken && resetEmail && 
                    <section className="w-full">
                        <div className="my-3 md:my-[1.5rem]">
                            <label
                                htmlFor="password"
                                className="block mb-1 text-sm md:text-[14px] font-medium text-gray-900 dark:text-white"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 md:py-[4px] px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Type your new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="my-3 md:my-[1.5rem]">
                            <label
                                htmlFor="confirmPassword"
                                className="block mb-1 text-sm md:text-[14px] font-medium text-gray-900 dark:text-white"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2 md:py-[4px] px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {error && <p className="mt-3 text-red-500 text-xs md:text-[12px]">{error}</p>}
                        </div>
                        <button
                            type='button'
                            onClick={handleResetPassword}
                            className='px-4 md:px-5 w-full md:w-fit mx-auto py-2 rounded-md text-white bg-[#587FD9] disabled:opacity-50 text-sm md:text-base flex justify-center'
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Change Password"}
                        </button>
                    </section>
                }
                {!resetToken && !resetEmail && 
                    <>
                        <h2 className='text-center text-lg md:text-xl mb-4'>Enter your email here</h2>
                        <form className='flex flex-col gap-3 md:gap-5 my-auto w-full' onSubmit={handleFormSubmit}>
                            <input 
                                required 
                                type="email" 
                                placeholder='Enter your email' 
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full px-3 md:px-5 py-2 border border-gray-400 rounded-md text-sm md:text-base' 
                            />
                            {message && <p className='text-center text-xs md:text-sm text-gray-400'>{message}</p>}
                            <button
                                type='submit'
                                className='px-4 md:px-5 w-full md:w-fit mx-auto py-2 rounded-md text-white bg-[#587FD9] disabled:opacity-50 text-sm md:text-base flex justify-center'
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Reset Password"}
                            </button>
                        </form>
                    </>
                }
            </div>
        </div>
        <div className='flex-1'> <Footer /> </div>
    </main>
  );
};

export default ForgotPassword;
