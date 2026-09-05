import { FaSquareInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { RiFacebookCircleFill } from "react-icons/ri";

const S1 = () => {
  return (
    <div className='px-5 text-white'>
      <span className='text-3xl font-semibold bg-gray-600 rounded-xl p-2'>PGRS</span>
      <p className='pt-4'>An initiative to help people to raise voice against their problems</p>
      <div className='flex gap-5 py-4 invert bg-transparent text-transparent'> 
        <a href="https://instagram.com">
          <FaSquareInstagram className="text-green-600 text-4xl"/>
        </a>
        <a href="https://linkedin.com">
          <FaLinkedin className="text-orange-500 text-4xl"/>
        </a>
        <a href="https://twitter.com">
          <AiFillTwitterCircle className="text-orange-500 text-4xl" />
        </a>
        <a href="https://facebook.com">
          <RiFacebookCircleFill className="text-orange-500 text-4xl" />
        </a>
        
        
        
      </div>
    </div>
  )
}

export default S1
