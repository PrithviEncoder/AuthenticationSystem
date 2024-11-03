import React, { useEffect, useState } from 'react'
import Input from '../components/Input'
import {Mail ,Lock} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthStore from '../stateManagment/authStore'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [localError, setLocalError] = useState('');

  const { login, error } = AuthStore();

  const navigate = useNavigate();

  const handleEmailChange = (e) => { 
    setEmail(e.target.value);
  }
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    //api backend
    const success = await login(email, password);
    
    if (success) {
      toast.success('User LoggedIn Successfully');
      //with below code too function over over login route will take u to home but for security it is written
      setTimeout(() => {
        navigate('/');
      }, 1000);
    
    }
    else {
      setLocalError(error);
      console.log("login failed", error);//debugging
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

  

  return (
    <div className='flex w-screen h-screen justify-center items-center'>

      <div className="box w-[380px] h-[385px] bg-green-900 rounded-md relative">

        <h1 className='heading text-3xl font-bold text-green-500 text-center mt-8'>Welcome Back</h1>
<form onSubmit={handleSubmit}> <Input
          icon={Mail}
          type={'text'}
          placeholder={'Enter your Email'}
          value={email}
          onChange={handleEmailChange}
        /> 
        <Input 
          icon={Lock}
          type='password'
          placeholder='Password'
          value={password}
          onChange={handlePasswordChange}
        />

          <p className="error text-red-500 text-center">{localError}</p>

        <p className="forgotPassword text-green-500 ml-9 mt-5"><Link to={'/forgot-password'}>Forgot password?</Link></p>

        <button className="Btn w-4/5 h-11 bg-green-500 rounded-md text-white font-bold mt-6 ml-9">Login</button></form>
       

        <div className="signup w-full h-12 rounded-b-md bg-gray-800 absolute bottom-0 justify-center items-center text-white flex">
          <span className=''>Don't have account </span>
          <span className='text-green-500'><Link to='/register'>?Sign up</Link></span>
        </div>

      </div>




    </div>
  )
}

export default Login