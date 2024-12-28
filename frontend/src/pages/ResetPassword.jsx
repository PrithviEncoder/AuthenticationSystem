import React, { useState } from 'react'
import Input from '../components/Input.jsx'
import { Lock } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthStore from '../stateManagment/AuthStore.jsx'
import toast from 'react-hot-toast'


const ResetPassword = () => {

    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const { token } = useParams();//since you have recieve params by this name in routes in frontend
    const { resetPassword, error } = AuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await resetPassword(token, pass, confirmPass);

        if (success) {
            toast.success("Password reset successfully")
            setTimeout(() => {
            navigate('/login');
            }, 1500);

        }
        else {
            console.error('errror:', error);
        }
    }

    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <div className="box w-[400px] h-[300px] bg-green-900 rounded-md">

                <h1 className="heading text-3xl font-semibold text-green-500 text-center mt-6">Reset Password</h1>

                <form onSubmit={handleSubmit}>
                    <Input
                        type='password'
                        placeholder='Enter Password'
                        icon={Lock}
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                    />
                    <Input
                        type='password'
                        placeholder='Enter Confirm Password'
                        icon={Lock}
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                    />
                    <p className="error text-sm text-center text-red-500">{ error}</p>

                    <button className='w-4/5 h-11 text-white bg-green-500 rounded-md ml-10 mt-8 font-semibold'>
                        Reset Password
                    </button>
                </form>


            </div>
        </div>
    )
}

export default ResetPassword