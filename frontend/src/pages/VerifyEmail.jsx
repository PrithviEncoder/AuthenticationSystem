import React, { useState } from 'react'
import AuthStore from '../stateManagment/AuthStore.jsx';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState('');

  const { emailVerify,error } = AuthStore();

  const navigate = useNavigate();

  const handleChange = (e, index) => {
   
    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);


    if (e.target.value.length === 1 && index < code.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    if (e.target.value.length === 0 && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }

  }
 
  const handleVerify = async () => {
    const verificationCode = code.join("");
    console.log("verification code : ", verificationCode);

    if (verificationCode.length !== 6) {
      console.error("Enter a 6 digit code");
      setErrorMessage('Enter a 6 digit code')
    }
    else {
      setErrorMessage('');
    }

    //api backend 
    const success = await emailVerify(verificationCode);

    if (success) {
      navigate('/');
    }
    else {
      console.log("error", error);//debugging
    }

  }

  return (
    <div className='w-screen h-screen flex justify-center items-center'>

      <div className="w-[420px] h- bg-gray-800 rounded-md ">

        <h1 className='text-center text-green-500 font-bold text-3xl mt-4 '>Verify Your Email</h1>

        <p className='text-white text-center mt-4'>Enter the 6 digit code sent to your email address</p>

        <div className="ml-6 mt-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}//Unique ID for each input
              className='w-12 h-12 ml-3 rounded-md outline-none text-center font-bold'
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e, index)}
            />
          ))}
        </div>

        <p className='text-red-600 text-center'>{errorMessage}</p>
        <p className='text-red-600  text-sm text-center'>{error}</p>

        <div className="Btn text-white mb-8 w-4/5 h-11 bg-green-500 rounded-md m-auto font-bold mt-8 flex justify-center items-center"
        onClick={handleVerify}
        >Verify Email</div>


      </div>



    </div>
  )
}

export default VerifyEmail