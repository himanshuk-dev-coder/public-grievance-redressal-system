import React from 'react'

const TopSection = () => {
  return (
    <div className='flex justify-between px-25 py-8 bg-blue-800 text-white text-white-300 '>
      <div className='text-xl font-medium text-center'>
        <p>100+</p>
        <p>Complaints <br/> Registered</p>
        </div>
      <div className='text-xl font-medium text-center'>
        <p>20+</p>
        <p>Authorities <br/> Associated</p>
      </div>
      <div className='text-xl font-medium text-center'>
        <p>5+</p>
        <p>Categories <br/> Served</p>
      </div>
    </div>
  )
}

export default TopSection
