import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect,useRef } from "react";
import { useAuth } from "../utils/AuthContext";
const Login = () => {
    const {user,loginUser}= useAuth();
    const navigate= useNavigate();
    const loginForm = useRef();
    useEffect(()=>{
      if(user){
        navigate("/")
      }
    },[user])

    const handleSubmit=(e)=>{
        e.preventDefault();
        const email= loginForm.current.email.value
        const password = loginForm.current.password.value
        const userInfo ={email, password}
        loginUser(userInfo)
    }
  return (
   <motion.div
  className="min-h-screen flex items-center justify-center bg-white text-gray-900 px-4"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <div className="w-full max-w-md bg-gray-100 p-8 rounded-2xl shadow-lg">
    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
    <form className="space-y-4" ref={loginForm} onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <button
        type="submit"
       
        className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-colors duration-200"
      >
        Sign In
      </button>
    </form>
    <p className="text-sm text-center mt-4">
      Don't have an account?{" "}
      <Link to="/register" className="text-blue-600 hover:underline">
        Register
      </Link>
    </p>
  </div>
</motion.div>

  );
};

export default Login;
