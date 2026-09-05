import React from 'react'

const CardFeature = ({head, f1, f2, f3, img}) => {
  return (
    <div className='px-5 py-5' >
      <div className='h-100 w-70 rounded-4xl bg-cover' style={{backgroundImage: `url(${img})`}}>
        <div className='h-full w-full flex flex-col justify-between py-5 bg-black/45 rounded-4xl' >    
          <h2 className='text-center text-2xl font-semibold text-gray-100'>{head}</h2>
          <ul className='text-gray-300 text-xl font-medium px-5 h-3/7 flex flex-col justify-between'>
            <li>{f1}</li>
            <li>{f2}</li>
            <li>{f3}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CardFeature
