import React from "react";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 justify-center items-center">
      <div className="hidden lg:flex flex-[1.5] items-center justify-center bg-gray-50 rounded-l-[18px]">
        <img
          src="/forgot.jpg"
          alt="Forgot Password Illustration"
          className="max-w-[70%] h-auto rounded-xl"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center items-center bg-white shadow-[0_2px_24px_0_rgba(0,0,0,0.04)] rounded-r-[18px] lg:rounded-l-none rounded-[18px] lg:rounded-r-[18px] p-10 lg:p-8 min-w-[320px] w-full lg:w-auto">
        <div className="text-xl font-bold text-gray-400 mb-6 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Serene Minds Logo"
            className="h-8 align-middle"
          />
        </div>
        <h2 className="m-0 mb-2 text-xl text-gray-900 font-semibold tracking-tight">
          Forget Password
        </h2>
        <p className="text-gray-500 mb-6 text-base font-normal">
          Enter your email and we'll send you instructions to reset your
          password.
        </p>
        <form className="w-full max-w-[320px] flex flex-col gap-3 bg-transparent shadow-none">
          <label className="mb-1 text-gray-700 text-[0.97rem] font-medium">Email</label>
          <input
            type="email"
            placeholder="Example@gmail.com"
            className="py-2.5 px-4 mb-0.5 border border-gray-300 rounded-lg text-base bg-gray-50 outline-none transition-colors focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            required
          />
          <button
            type="submit"
            className="bg-[#1cc5b7] text-white border-none rounded-lg py-3 text-lg font-semibold cursor-pointer mt-2 mb-4 transition-colors hover:bg-[#179e91] shadow-none"
          >
            Continue
          </button>
        </form>
        <div className="text-center text-[0.97rem] text-gray-500 mt-5 font-normal">
          <Link to="/login" className="text-[#1cc5b7] no-underline text-sm transition-colors font-medium hover:text-[#179e91] hover:underline">
            &lt; Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

