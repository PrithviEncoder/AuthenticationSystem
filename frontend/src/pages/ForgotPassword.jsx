import React, { useState } from 'react'
import Input from '../components/Input.jsx';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthStore from '../stateManagment/AuthStore.jsx';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [err, setErr] = useState('');

  const navigate = useNavigate();
  const { forgotPassword ,error} = AuthStore();

  const handleChange = (e) => {
    setEmail(e.target.value);
 }

  const handleSubmit = async (e) => {
   
    e.preventDefault();

    //take to this in any case
    setIsSubmitted(true);
  
    const success = await forgotPassword(email);
    if (success) {
      toast.success('Reset Link Sent to your Email')
      setTimeout(() => {
      navigate('/')
      }, 1500);
    }
    else {
      console.error("error", error);
    }
   


}

  return (
  
    <div className='w-screen h-screen flex justify-center items-center'>

      <div className="outer-box flex justify-center items-center w-[450px] h-[380px] bg-green-700 ">
        <div className="inner-box relative w-4/5 h-4/5 bg-green-900 rounded-md">
          
        <h1 className="head font-bold text-2xl text-center text-green-500 mt-4">Forgot Password</h1>

          {//start
            !isSubmitted ? (<> 
          <p className="message text-white text-sm text-center mt-4">Enter your Email address and we'll send you a link to reset your password</p>
       
          <form onSubmit={handleSubmit}>
          <Input
            icon={Mail}
            type='email'
                  placeholder='Email Address'
                  onChange={handleChange}
            value={email}

                />
              
        
                <button className='Btn w-4/5 h-11 bg-green-500 rounded-md ml-8 mt-6 text-white font-semibold'
                >Send Reset Link</button></form></>)
                 :
               (<>
            <div className="w-14 h-14 m-auto mt-5 flex items-center justify-center rounded-full bg-green-500">
              <Mail size={24} color='white' />
              </div>
              <div className="info mt-8">
                <p className='text-white text-center'>If an account exists for {email},</p>
                  <p className="text-white text-center">you will recieve a password reset link shortly</p>

                  <p className='text-red-500 text-sm text-center'>{error}</p>
              </div>
            </>)
          //end
          }
          

          <div className="link  absolute bottom-0 rounded-b-md w-full h-11 bg-gray-800 text-center ">
            <Link to={'/login'} className='text-center'>
               <span className='text-green-500 '>Back to Login</span>
            </Link>
          </div>
          
        </div>

      </div>
   
      


    </div>
  )
}

export default ForgotPassword