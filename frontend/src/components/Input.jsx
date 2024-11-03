
import React from 'react'

const Input = ({ type, placeholder,icon:Icon, onChange,value }) => {
    

  return (
      <div className=' w-4/5 h-[35px] mt-6 flex bg-green-950 m-auto rounded-md'>
          <Icon  className="m-auto ml-2" color="green" size={24} />
      <input
        className='w-full h-full ml-4 bg-green-950 rounded-md outline-none text-white'
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}

      />
      </div>
  )
}

export default Input