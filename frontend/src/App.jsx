import { Routes,Route, Navigate } from "react-router-dom"
import Register_page from "./pages/Register_page.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx"
import Login from "./pages/Login.jsx"
import AuthStore from "./stateManagment/AuthStore.jsx"
import { useEffect } from "react"
import Home from "./pages/Home.jsx"
import { Toaster } from 'react-hot-toast';
import ForgotPassword from "./pages/ForgotPassword.jsx"
import ResetPassword from "./pages/ResetPassword.jsx"

 //protection routes
//imp .React automatically passes any child elements of a component as children. While you can name most props anything you want, children is a reserved prop name that React uses to handle whatever is placed between the opening and closing tags of a component.
 /*<SomeComponent>
  <p>This is a child element</p>
  </SomeComponent>*/

const ProtectRoutes =  ({ children }) => {
  const { isAuthenticated, isChecking, user } = AuthStore();
  console.log("are you auth ", isAuthenticated);

  // Show loading indicator while checking auth
  if (isChecking) {
      return <div>Loading...</div>;
  }

  // If not authenticated, navigate to login
  if (!isAuthenticated) {
      return <Navigate to='/login' replace />;
  }

  // If user is not verified, navigate to verify
  if (!user?.isVerified) {
      return <Navigate to='/verify' replace />;
  }
  return children; // Render the protected child routes
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = AuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />;
  }
  return children;
}



function App() {

  
  const { isChecking, checkAuth, isAuthenticated,user } = AuthStore();
  
  useEffect(() => {
    //idk but if problem is checkauth then can we send user to login navigate
    checkAuth();
  }, [checkAuth]);
  console.log('isAuthenticated', isAuthenticated);
  console.log('user',user)  

 


  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-600 via-emerald-800 to-gray-700 ">

      <Routes>
        <Route path="/" element={<ProtectRoutes><Home /></ProtectRoutes>} />
        
        <Route path="/register" element={<RedirectAuthenticatedUser><Register_page /></RedirectAuthenticatedUser>} />
        
        <Route path="/login" element={<RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>} />
        
        <Route path="/verify" element={<VerifyEmail />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword/>}/>
        

      </Routes>

    <Toaster/>
      
    </div>
  )
}

export default App
