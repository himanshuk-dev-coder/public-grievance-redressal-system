import React from 'react'
import { Link } from 'react-router-dom'

const S3 = () => {
  return (
    <div className='px-5 text-white'>
      <h3 className='text-2xl font-mono'>Links</h3>
        <div className='flex flex-col'>
          <Link to='/raise-complaint'>Raise Complaint</Link>
          <Link to='/track-complaint'>Track Complaint</Link>
          <Link to='/working'>How it Works</Link>
          <Link to='/feedback'>Feedback</Link>
        </div>
    </div>
  )
}

export default S3
