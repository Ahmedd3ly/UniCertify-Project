import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const UploadCertificate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { uploadCertificate } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    id: '',
    university: '',
    issueDate: '',
    image: '',
    certificate: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true)
        await uploadCertificate({ ...form })
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
      }
    })
  }
  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Create a Certificate</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Student Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField
            labelName="Student ID *"
            placeholder="123456"
            inputType="number"
            value={form.id}
            handleChange={(e) => handleFormFieldChange('id', e)}
          />
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="University *"
            placeholder="Enter your university"
            inputType="text"
            value={form.university}
            handleChange={(e) => handleFormFieldChange('university', e)}
          />

          <FormField
            labelName="Issue Date *"
            placeholder="Issue Date"
            inputType="date"
            value={form.issueDate}
            handleChange={(e) => handleFormFieldChange('issueDate', e)}
          />
        </div>

        <FormField
          labelName="Student Image *"
          placeholder="Place image URL of student"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        <FormField
          labelName="Student Certificate *"
          placeholder="Upload the student's certificate"
          inputType="file"
          value={form.certificate}
          handleChange={(e) => handleFormFieldChange('certificate', e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new certificate"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  )
}

export default UploadCertificate