import React from 'react'
import { create } from 'zustand'
import axios, { isAxiosError } from 'axios'


//when deploying REACT_APP_API_URL will be applied in env of render now it is not there so on dev 3000 will run.
const API_BASE_URL =import.meta.env.MODE==="development" ? "http://localhost:3000" : "";

const AuthStore = create((set) => (//return
    {
        user: null,
        isAuthenticated: false,
        isChecking: false,
        isLoading: false,
        error: null,
        

        signup: async (fullname, email, password) => {
            try {
                set({ isAuthenticated: false, isLoading: true, user: null, isChecking: true, error:null })
                const formData = {
                    name: fullname,
                    email,
                    password,
                };
                const response = await axios.post(`${API_BASE_URL}/user/register`, formData,
                    //very imp without it cookies will not be stored and in backend cors credentials:true;
                    {
                        withCredentials: true
                    }
                )


                set({ user: response.data.data, isAuthenticated: true, isLoading: false, isChecking: false, error:null })

                return true
            } catch (error) {
                set({
                    error: error.response ? error.response.data.message : 'Registration failed',
                    isLoading: false,
                    isChecking: false,
                })
                   
                return false
            }

        },

        emailVerify: async (code) => {
            try {
                set({ isLoading: true, isChecking: true, user: null, error:null})
                
                const response = await axios.post(`${API_BASE_URL}/user/verify-email`,
                    {
                        code
                    },
                    { withCredentials: true}
                )
    
                set({isLoading:false, isChecking:false, user:response.data?response.data.data:"", error:null})
    
                return true
            } catch (error) {
                set({
                    error: error.response ? error.response.data.message : 'Cannot verify User',
                    isLoading: false,
                    isChecking:false
                })
                return false
            }



        },

        login: async (email, password) => {

          try {
              set({ user: null, isAuthenticated: false, ischeking: true, isLoading: true, error:null })
              
              const response = await axios.post(`${API_BASE_URL}/user/login`,
                  {
                      email,
                      password
                  },
                  {withCredentials:true}
              );
  
              set({ isLoading: false, ischeking: false, isAuthenticated: true, user: response.data.data, error:null})
              return true;
          } catch (error) {
              set({ error: error.response ? error.response.data.message : "Login failed",ischeking:false,isLoading:false })
              
            }
            return false

        },

        checkAuth: async () => {
            set({ isChecking: true, error: null });

            try {
               //axios.get(url, config)

               const response = await axios.get(`${API_BASE_URL}/user/check-auth`,
                   // In a GET request, the second argument is for configuration options like withCredentials, and you were passing an empty object which had no effect.is cause error
                   { withCredentials: true });
             
               set({ user: response.data.data||null, isAuthenticated: true, isChecking: false, error:null })
               return true;
           } catch (error) {
               set({ error: null, isChecking: false, isAuthenticated: false })               
           }
            return false
        },

        forgotPassword: async (email) => {
            set({ user: null, isLoading: false, error: null });
            try {
                const response = await axios.post(`${API_BASE_URL}/user/forgot-password`, { email });
                set({ isLoading: false, user:response.data.data, error:null })
                return true
            } catch (error) {
                set({ error: error.response?.data.message || "Error in forgot password" })
                return false
            }
        },

        resetPassword: async (token,password,confirmPassword) => {
            set({ user: null, isLoading: true, error: null });

            try {
                const response = await axios.post(`${API_BASE_URL}/user/reset-password/${token}`,
                    { password, confirmPassword });
                
                set({user:response.data.data, isLoading:false, error:null})
                
                return true;
            } catch (error) {
                set({ error: error.response?.data?.message, isLoading: false })
                return false
            }
        },
        logout: async () => {
            set({isLoading:true, error:null})
            try {
              //  axios.post(url, data, config)
             const response = await axios.post(`${API_BASE_URL}/user/logout`,{},{ withCredentials: true });
             
               set({ isLoading: false, isAuthenticated: false, user: null })
               //isauthenticated :false it is imp because it is used inside protective and other function with cover element of route
               return true;
           } catch (error) {
                set({ error: error.response.data.message || "Logout process failed" })
                return false
           }
        }
    }

))
export default AuthStore