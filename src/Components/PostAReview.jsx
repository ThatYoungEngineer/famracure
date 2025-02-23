import { Spinner } from 'flowbite-react'
import { useState } from 'react'
import axiosClient from '../AxiosClient'

const PostAReview = ({doctorId, handleReRender}) => {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const disabled = !doctorId || isLoading || !rating || !comment

    const handleRatingClick = (index) => {
        setRating(index + 1)
    };

    const handlePostClick = async() => {
        try {
            setIsLoading(true)
            setError("")
            setSuccess("")

            const reviewData = {
                doctor_id: doctorId,
                comments: comment,
                rating: rating
            }

            const response = await axiosClient.post(`/reviews`, reviewData);
            if (response?.data?.message) {
                setSuccess(response?.data?.message)
                setComment("")
                setRating(0)
                handleReRender()
            } else {
                throw new Error()
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message
            if (errorMessage) {
                setError(errorMessage)
            } else {
                setError("Network Error")
            }
        } finally {
            setIsLoading(false)
        }

    }

  return (

    <div className="max-w-4xl mx-auto my-5 flex flex-col gap-4">
        <div className='w-full flex items-center justify-between'>
            <h1 className="flex-1 text-xl font-extralight">Add a Review</h1>
            {(success || error) && 
                <section className='flex-1 flex items-center justify-end'>
                    <div className={`flex-1 text-center px-4 py-2 rounded-lg mx-auto
                        ${error ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"}`}
                    >
                        {error ? error : success}
                    </div>
                </section>
            }
        </div>
      <div className='flex'>
        {Array.from({ length: 5 }, (_, i) => (
            <button
            type='button'
            disabled={isLoading}
            key={i}
            onClick={() => handleRatingClick(i)} // Handle click on each star
            className={`disabled:opacity-40 cursor-pointer text-2xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
            >
                <i className="fas fa-star"></i>
            </button>
        ))}
      </div>
      <textarea 
        value={comment}
        disabled={isLoading} name="comment" id="comment" 
        className='w-full min-h-[5.25rem] disabled:opacity-40 transition-all duration-150 resize-none' 
        onChange={(e)=>setComment(e.target.value) } 
      />
      <div className='w-full flex items-center justify-end'>
        <button 
            type="button" 
            className="py-2 rounded-md bg-blue-300 text-blue-800 w-24
            disabled:opacity-60 disabled:cursor-not-allowed
            active:bg-blue-400 active:scale-95 transition-all duration-150"
            onClick={handlePostClick}
            disabled={disabled}
        >
            {isLoading ? <Spinner className='opacity-60' /> : "Post"}
        </button>
      </div>

    </div>
      

  )
}

export default PostAReview