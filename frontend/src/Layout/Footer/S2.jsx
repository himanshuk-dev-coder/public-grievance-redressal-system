import React from 'react'
import { Link } from 'react-router-dom'

const S2 = () => {
  return (
    <div className='px-5 text-white'>
      <h3 className='text-2xl font-mono'>PGRS</h3>
      <div className='flex flex-col'>
        <Link to='/'>Home</Link>
        <Link to='/about'>About</Link>
        <Link to='/contact'>Contact Us</Link>
        <Link to='/faq'>FAQ</Link>
      </div>
    </div>
  )
}

export default S2
