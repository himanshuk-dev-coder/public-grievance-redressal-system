import React from 'react'
import S1 from './S1'
import S2 from './S2'
import S3 from './S3'
import S4 from './S4'
import LastFooter from './LastFooter'

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-gray-500 rounded-xl">
      
      {/* Main Footer Sections */}
      <div className="flex flex-wrap p-10">
        <div className="w-full md:w-1/4">
          <S1 />
        </div>
        <div className="w-full md:w-1/4">
          <S2 />
        </div>
        <div className="w-full md:w-1/4">
          <S3 />
        </div>
        <div className="w-full md:w-1/4">
          <S4 />
        </div>
      </div>

      {/* Bottom Bar */}
      <LastFooter />
    </footer>
  );
};

export default Footer;



