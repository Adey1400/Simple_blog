import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
const Register = () => {
  const registerForm = useRef(null);
  const { user, registerUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = registerForm.current.name.value;
    const email = registerForm.current.email.value;
    const password1 = registerForm.current.password1.value;
    const password2 = registerForm.current.password2.value;
    if (!name || !email || !password1 || !password2) {
      alert("Please fill out all fields");
      return;
    }
    if (password1 !== password2) {
      alert("password do not match");
      return;
    }
    const userInfo = {
      name,
      email,
      password: password1,
    };
    registerUser(userInfo);
  };
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-white text-gray-900 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-md bg-gray-100 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form className="space-y-4" ref={registerForm} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            name="password1"
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            name="password2"
            placeholder="Confirm your password"
            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
