import React from 'react'
import { Link } from 'react-router-dom'

const LeftSection = () => {
  return (
    <div className='bg-gray-200 flex flex-col justify-between h-full px-15 py-12'>
      <h2 className='text-5xl font-bold'>Your Voice Matters- Raise and Track Complaint...</h2>
        <h4 className='text-2xl text-gray-600'>Empowering citizens to report issues and get transparent resolutions from authorities.</h4>
         <div className='flex justify-between pb-5'>
             <Link to='/raise-complaint'><button className='border rounded-full p-4 text-xl bg-blue-800 text-white '>Raise Complaint</button></Link>
             <Link to='/track-complaint'><button className='border rounded-full p-4 text-xl bg-blue-800 text-white '>Track your Complaint</button></Link>
         </div>
    </div>
  )
}

export default LeftSection;
