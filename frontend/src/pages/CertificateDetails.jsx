import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { thirdweb } from '../assets';

const CertificateDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { checkCertificate, downloadCertificate } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [viewLink, setViewLink] = useState('');
  const [buffer, setBuffer] = useState([]);

  const handleView = async () => {
    setViewLink(`https://ipfs.io/ipfs/${state.hash}`); // Replace with the actual URL that you want to open
    window.open(viewLink, '_blank'); // Open the URL in a new tab
  }

  const handleDownload = async () => {
    setIsLoading(true);
    await downloadCertificate(`https://ipfs.io/ipfs/${state.hash}`, `${state.id}`);
    navigate('/')
    setIsLoading(false);
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const fileBuffer = Buffer.from(reader.result);
      setBuffer(fileBuffer);
      console.log(fileBuffer)
    };
  }

  const handleVerification = async () => {
    setIsLoading(true);
    await checkCertificate(buffer);
    navigate('/');
    setIsLoading(false);
  };

  useEffect(() => {
    if (buffer > 0) handleVerification();
  }, [buffer]);

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="certificate" className="w-full h-[410px] object-cover rounded-xl" />
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="1st year" value="76%" />
          <CountBox title="2nd year" value="68%" />
          <CountBox title="3rd year" value="71%" />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.adminName}</h4>
                <p className="mt-[4px] font-epilogue font-semibold text-[12px] text-[#808191]">{state.adminEmail}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Details</h4>

            <div className="grid grid-cols-2  mt-[10px] flex flex-row flex-wrap gap-[50px]">
              <p className="font-epilogue font-semibold text-[18px] text-[#808191]">{"Student Name: "}
                <span className="font-epilogue font-semibold text-[18px] text-white">{state.name}</span> </p>
              <p className="font-epilogue font-semibold text-[18px] text-[#808191]">{"University: "}
                <span className="font-epilogue font-semibold text-[18px] text-white">{state.uni}</span> </p>
            </div>

            <div className="grid grid-cols-2 mt-[10px] flex flex-row flex-wrap gap-[50px]">
              <p className="font-epilogue font-semibold text-[18px] text-[#808191]">{"Student ID: "}
                <span className="font-epilogue font-semibold text-[18px] text-white">{state.id}</span> </p>
              <p className=" font-epilogue font-semibold text-[18px] text-[#808191] ">{"Issued at: "}
                <span className="font-epilogue font-semibold text-[16px] text-white ">{new Date(state.issueDate).toDateString()}</span> </p>
            </div>

          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">QR code</h4>
            <div className="mt-[10px] flex flex-row items-center flex-wrap gap-[14px]">
            </div>
          </div>
          <div className="flex mx-4 justify-center gap-4">
            <CustomButton
              btnType="button"
              title="Download Certificate"
              styles="w-1/3 bg-[#1dc071]"
              handleClick={handleDownload}
            />
            <CustomButton
              btnType="button"
              title="View Certificate on IPFS"
              styles="w-1/3 bg-[#1B99D4]"
              handleClick={handleView}
            />
          </div>

          <div className="flex-1">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Verify</h4>

            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
              <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Verify the certificate
              </p>
              <div className="mt-[30px]">
                <input
                  type="file"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  onChange={(e) => handleFileUpload(e)}
                />

                <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                  <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Upload the certificate to verify if the hash matches.</h4>
                  <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Verification process is for free (i.e., without paying gas fees).</p>
                </div>

                <CustomButton
                  btnType="button"
                  title="Verify Certificate"
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={handleVerification}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CertificateDetails