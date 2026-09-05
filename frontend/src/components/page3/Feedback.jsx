import React from 'react'
import FeedbackCard from './FeedbackCard'
import Footer from '../../Layout/Footer/Footer'

const Feedback = () => {

  

  return (
    <>
      <div className='bg-blue-200 m-6 rounded-xl'>
        <h2 className='text-center text-3xl py-5 font-semibold bg-gray-800 text-white'>Feedback / Testimonials</h2>
        <div className='flex px-15 py-10 gap-5'>
            <FeedbackCard />
            <FeedbackCard />
            <FeedbackCard />
            <FeedbackCard />
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Feedback
