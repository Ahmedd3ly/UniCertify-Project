import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { useStateContext } from '../context';
import { CustomButton, FormField, Loader } from '../components';


const AddAdmin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { addAdmin } = useStateContext();
  const [form, setForm] = useState({
    title: '',
    name: '',
    email: '',
    university: '',
    address: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true)
    await addAdmin({ ...form })
    setIsLoading(false);
    navigate('/');
  }
  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Create an Admin</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Title *"
            placeholder="Mr. / Mrs."
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
          <FormField
            labelName="Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Email *"
            placeholder="johndoe@university.com"
            inputType="text"
            value={form.email}
            handleChange={(e) => handleFormFieldChange('email', e)}
          />
          <FormField
            labelName="University *"
            placeholder="Enter your university"
            inputType="text"
            value={form.university}
            handleChange={(e) => handleFormFieldChange('university', e)}
          />
        </div>

        <FormField
          labelName="Admin Address"
          placeholder="0x12345......"
          inputType="address"
          value={form.address}
          handleChange={(e) => handleFormFieldChange('address', e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Assign new admin"
            styles="bg-[#1B99D4]"
          />
        </div>
      </form>
    </div>
  )
}

export default AddAdmin