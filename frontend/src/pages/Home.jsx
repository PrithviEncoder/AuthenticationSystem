import React from 'react'
import AuthStore from '../stateManagment/authStore'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const { logout ,error} = AuthStore();
  const navigate = useNavigate();

  const Logout = async () => {
  
    const success = await logout();

    if (success) {
      toast.success("user is logged out successfully");
      
      //due to our protective function on home route below code is of no use but for security let it be.

      setTimeout(() => {
        navigate('/login')
      }, 1000);
    } else {
      console.error("error", error);
    }

}

  const { user } = AuthStore();
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className="dashboard flex flex-col w-[400px]  bg-gray-800 rounded-md">

        <h1 className='head fond-bold text-3xl text-center mt-8 text-green-500'>Dashboard</h1>

        <div className="info mt-4 w-4/5 h-32 rounded-md bg-gray-700 m-auto">

          <h1 className="subhead text-green-500 text-xl font-semibold text-center">Personal Info</h1>

          <p className="name ml-6 mt-4 text-white">Name : {user.name}</p>

          <p className="email ml-6 text-white">Email :  {user.email}</p>

        </div>

        <div className="info mt-4 mb-6 w-4/5 h-32 rounded-md bg-gray-700 m-auto">

          <h1 className="subhead text-green-500 text-xl font-semibold text-center">Login Info</h1>

          <p className="name ml-6 mt-4 text-white">LastLogin : {user.lastLogin}</p>

          <p className="email ml-6 text-white">Created At :  {user.createdAt}</p>

          <p className="email ml-6 text-white">Updated At :  {user.updatedAt}</p>

        </div>

        <p className="error text-red-500 text-sm text-center">{error}</p>
        <button
          className='logout w-4/5 h-10 bg-green-500 rounded-md text-center text-white font-semibold mb-4 ml-10'
        onClick={Logout}
        >Logout</button>

      </div>
    </div>
  )
}

export default Home