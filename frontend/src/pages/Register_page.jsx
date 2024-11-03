import React, { useState,useEffect } from 'react'
import Input from '../components/Input'
import { Mail, Lock, User } from 'lucide-react'
import PasswordMeter from '../components/PasswordMeter'
import AuthStore from '../stateManagment/authStore'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'

const Register_page = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { signup ,error} = AuthStore();

  const navigate = useNavigate();
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  const handleFullnameChange = (e) => {
    setFullname(e.target.value)
  }
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit =async (e) => {
    e.preventDefault();
    //api for backend
    const success = await signup(fullname, email, password);
   toast.success('User is registered,sending User to verify page....')
  if (success) {
    navigate('/verify');
  } else {
    console.log('Signup failed:', error); // Log error for debugging
    setLocalError(error);
  }
    
  }
  useEffect(() => {
    if (localError) {
      const timer=setTimeout(() => {
        setLocalError('');
      }, 1500);
    return () => clearTimeout(timer);//cleanup if components unmount
    }
  },[localError])
  console.log('Initial password state:', password);

  return (
      <div className=' h-screen w-screen flex items-center justify-center'>
          
          <div className="w-[420px] h-[550px] bg-green-900 rounded-md relative">
              <h1 className='font-bold text-2xl text-center mt-4 text-green-500'>Create Account</h1>

        
        <form onSubmit={handleSubmit}><Input
          icon={User}
          type={"text"}
          placeholder={"Full Name"}
          value={fullname}
          onChange={handleFullnameChange}
        />
         
        <Input
          icon={Mail}
          type={"email"}
          placeholder={"Email Address"}
          value={email}
          onChange={handleEmailChange}
        
        />
          
          
        <Input
          icon={Lock}
          type={"password"}
          placeholder={"Password"}
          value={password}
          onChange={handlePasswordChange}
        />

          <p className='text-red-500 font-semibold text-center'>{localError}</p>

              <PasswordMeter password={password} />

              <button className='Btn w-4/5 h-[39px] rounded-md bg-green-500 text-center text-white font-semibold absolute bottom-16 left-10'>Sign Up</button>
        </form>
        
        <div className="w-full h-10 rounded-b-md absolute bottom-0 bg-gray-800 text-white  text-center" >
          <span>Already Have Account</span>
          <span className='text-green-500'><Link to={'/login'}>?Login</Link></span>
        </div>
        
          </div>


    </div>
  )
}

export default Register_page