import React from 'react'
import LeftSection from './LeftSection'
import RightSection from './RightSection'

const Page1 = () => {
  return (
    <div className='flex'>
      <div className='w-3/7'><LeftSection /></div>
      <div className='w-4/7'><RightSection /></div>
    </div>
  )
}

export default Page1
