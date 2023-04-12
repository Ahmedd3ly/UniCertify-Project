import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { CONTRACT_ADDRESS } from '../constants';
import { create } from 'ipfs-http-client';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync: uploadCertificate } = useContractWrite(contract, "uploadCertificate")
  const { mutateAsync: addAdmin } = useContractWrite(contract, "addAdmin")

  const address = useAddress(); //Owner Address
  const connect = useMetamask();

  const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });

  const createAdmin = async (form) => {
    try {
      const call = await addAdmin({
        args: [
          form.address,
          form.name,
          form.university,
          form.email
        ]
      });

      alert(form.name + ' is assigned successfully.')
      console.info('Contract call success', call)
    } catch (error) {
      alert('Contract call failure', error.message)
      console.info('Contract call failure', error)
    }
  }

  const createCertificate = async (form) => {
    try {
      // Import the certificate buffer data and add to the IPFS using addCertToIPFS function.
      const ipfsHash = addCertToIPFS(form.certificate);

      const call = await uploadCertificate({
        args: [
          form.id,
          new Date(form.issueDate).getTime(),
          form.name,
          form.university,
          form.image,
          ipfsHash
        ]
      });

      alert(form.name + ' certifiacate is uploaded successfully.')
      console.info('Contract call success', call)
    } catch (error) {
      alert('Contract call failure', error.message)
      console.info('Contract call failure', error)
    }
  }

  function addCertToIPFS(certificate) {
    return new Promise((resolve, reject) => {
      ipfs.add(certificate)
        .then(result => {
          const hash = result.cid.toString();
          console.log('IPFS Hash:', hash);
          resolve(hash);
        })
        .catch(error => {
          console.error('IPFS Error:', error);
          reject(error);
        });
    });
  }

  const getCertificates = async () => {
    const certificates = await contract.call('getCertificates');

    const parsedCertificates = certificates.map((certificate, i) => ({
      id: certificate.id.toString(),
      uni: certificate.uni,
      name: certificate.name,
      hash: certificate.ipfsHash,
      image: certificate.image,
      issueDate: certificate.issueDate.toNumber(),
      adminName: certificate.adminName,
      adminEmail: certificate.adminEmail,
      pId: i
    }));

    return (parsedCertificates);
  }

  const getUserCertificates = async () => {
    const allCertificates = await getCertificates();

    const filteredCertificates = allCertificates.filter((certificate) => certificate.owner === address);

    return filteredCertificates;
  }

  const checkCertificate = async (certificate) => {
    try {
      const ipfsHash = addCertToIPFS(certificate);
      const isVerified = await contract.call('verifyCertificate', [ipfsHash]);

      if (isVerified) {
        alert('Certificate is verified!');
      } else {
        alert('Certificate is NOT verified!');
      }
    } catch (error) {
      alert('Contract call failure', error.message)
      console.info('Contract call failure', error)
    }
  }

  const downloadCertificate = async (url, fileName) => {
    try {
      // Fetch the file from the URL
      const response = await fetch(url);
      const blob = await response.blob();
  
      // Create a download link and trigger a click event to download the file
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName; // Set the desired file name
      downloadLink.click();
  
      // Clean up the URL object
      URL.revokeObjectURL(downloadLink.href);
  
      alert('Certificate downloaded successfully!');
    } catch (error) {
      alert('Failed to download Certificate', error.message);
      console.error('Failed to download Certificate', error);
    }
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        addAdmin: createAdmin,
        uploadCertificate: createCertificate,
        getCertificates,
        getUserCertificates,
        checkCertificate,
        downloadCertificate
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);