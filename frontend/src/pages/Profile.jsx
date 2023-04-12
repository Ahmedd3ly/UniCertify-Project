import React, { useState, useEffect } from 'react'

import { DisplayCertificates } from '../components';
import { useStateContext } from '../context'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);

  const { address, contract, getUserCertificates } = useStateContext();

  const fetchCertificates = async () => {
    setIsLoading(true);
    const data = await getUserCertificates();
    setCertificates(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract) fetchCertificates();
  }, [address, contract]);

  return (
    <DisplayCertificates
      title="My Certificates"
      isLoading={isLoading}
      certificates={certificates}
    />
  )
}

export default Profile