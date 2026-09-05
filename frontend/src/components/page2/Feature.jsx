import React from 'react'
import CardFeature from './CardFeature'

const Feature = () => {
  const features = [
    {
      head:'Feedback & Rating System',
      f1:'Rate the solution',
      f2:'Mark if satisfied or not',
      f3:'Reopen complaint if issue persists',
      img:'src/assets/feedback.jpg',
    },

    {
      head:'Grievance Submission',
      f1:'Simple form to submit complaint',
      f2:'Category selection(water, electricity, roads, etc)',
      f3:'Upload documents/images/video',
      img:'src/assets/submit.avif',
    },

    {
      head:'Grievance Tracking',
      f1:'Live status tracking',
      f2:'Timeline view of actions taken',
      f3:'Unique grievance ID search',
      img:'src/assets/track.avif',
    },

    {
      head:'Secure & Transparent',
      f1:'Role-based access control',
      f2:'Data encryption',
      f3:'Transparency for citizens',
      img:'src/assets/secure.avif',
    },
  ]

  return (
    <div className='flex justify-between px-12'>
      {
        features.map((feat) => {
          const {head, f1, f2, f3, img} = feat;
          return (
            <CardFeature head={head} f1={f1} f2={f2} f3={f3} img={img}/>
          )
        })
      }
    </div>
  )
}

export default Feature
