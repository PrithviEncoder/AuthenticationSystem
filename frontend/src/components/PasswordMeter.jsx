import React from 'react'
import { Check } from 'lucide-react'

const PasswordConditionDisplayer = ({ password }) => {

  const conditonArray = [
    { condition: "At least 6 characters", met: password.length >= 6 },
    { condition: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { condition: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { condition: "Contains a number", met: /\d/.test(password) },
    { condition: "Contains special character", met: /[^A-Za-z0-9]/.test(password)/*or /\W/.test(password) but it will give if string contain any character other than _,0-9,a-z,A-Z*/ }
  ]


  return (<div className='mt-3'>

    {conditonArray.map((value) => (

      <div key={value.condition} className='flex ml-10 '>


        {/*GPT */
          value.met ? (
            <Check color="green" size={24} />
          ) : (
            <div style={{ width: 24, height: 24, color: 'gray' }}>X</div>
          )
        /*till here */}

        <div className={`${value.met ? 'text-green-500' : 'text-white'}`}>{value.condition}</div>

      </div>

    ))}


  </div>)
}





const PasswordMeter = ({ password }) => {
  let strength = 0;
  const strengthChecker = (pass) => {
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/ && pass.match(/[A-Z]/))) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  }
  //return strength
  strengthChecker(password);
  let clr = '';
  let indicater = 'very weak'
  if (strength == 0) {
    clr = 'bg-gray-500';
    indicater = 'very weak';
  }
  if (strength == 1) {
    clr = 'bg-red-500';
    indicater = 'weak';

  }
  if (strength == 2) {
    clr = 'bg-orange-500';
    indicater = 'fair';

  }
  if (strength == 3) {
    clr = 'bg-green-400';
    indicater = 'good';

  }
  if (strength == 4) {
    clr = 'bg-green-600';
    indicater = 'strong';

  }






  return (
    <div className="w-full">

      <div className="w-4/5 m-auto mt-5">

        <div className="flex justify-between">
          <span className='text-white font-semibold text-sm'>Password strength</span>
          <span className='text-white text-sm font-semibold'>{strength ? indicater : 'very weak'}</span>
        </div>

        <div className="flex w-full  ">
          {[...Array(4).keys()].map((_, index) => (
            <div
              className={`h-1 w-1/4 mr-1 ${index < strength ? clr : 'bg-gray-500'} `}
              key={index}

            />
          ))}
        </div>

      </div>







      <PasswordConditionDisplayer password={password} />

    </div>

  )
}

export default PasswordMeter