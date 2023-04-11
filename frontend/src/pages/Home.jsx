import React, { useState, useEffect } from 'react'

import { DisplayCertificates } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);

  const { address, contract, getCertificates } = useStateContext();

  const fetchCertificates = async () => {
    setIsLoading(true);
    const data = await getCertificates();
    setCertificates(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract) fetchCertificates();
  }, [address, contract]);

  return (
    <DisplayCertificates
      title="All Certificates"
      isLoading={isLoading}
      certificates={certificates}
    />
  )
}

export default Home