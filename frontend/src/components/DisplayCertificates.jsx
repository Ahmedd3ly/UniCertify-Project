import React from 'react';
import { useNavigate } from 'react-router-dom';

import FundCard from './FundCard.jsx';
import { loader } from '../assets';

const DisplayCertificates = ({ title, isLoading, certificates }) => {
  const navigate = useNavigate();

  const handleNavigate = (certificate) => {
    navigate(`/certificate-details/${certificate.name}`, { state: certificate })
  }

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({certificates.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && certificates.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not uploaded any certificates yet.
          </p>
        )}

        {!isLoading && certificates.length > 0 && certificates.map((certificate) => <FundCard
          key={certificate.id}
          {...certificate}
          handleClick={() => handleNavigate(certificate)}
        />)}
      </div>
    </div>
  )
}

export default DisplayCertificates