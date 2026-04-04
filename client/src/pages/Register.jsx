import { Alert } from '@mui/material';
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {BsRobot} from "react-icons/bs";

const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.username.trim() === "") {
            setError("Username is required");
            return;
        }
        if (formData.email.trim() === "") {
            setError("Email is required");
            return;
        }
        if (formData.password.trim() === "") {
            setError("Password is required");
            return;
        }
        if (formData.confirmPassword.trim() === "") {
            setError("Confirm Password is required");
            return;
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        try {
            const url = `/api/users/register`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json();
            const { success, message, username, token, error } = result;

            if (success) {

                localStorage.setItem("token", token);
                localStorage.setItem("loggedInUser", JSON.stringify({ username }));
                
                setSuccess("Registration successful!");
                
                setTimeout(() => {
                    navigate(`/dashboard`);
                }, 1000);

                console.log("Registration successful:", result);
                setError("");
                // Optional: Redirect to login or show success message
            }
            else {
                if (message) {
                    setError(message);
                } else if (error) {
                    setError(error);
                } else {
                    setError("Registration failed. Please try again.");
                }
                return;
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">

                {/* Logo / Title */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <BsRobot className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">InterviewAI</h1>
                    <p className="text-gray-400 text-sm mt-1">Create your account</p>
                </div>

                {/* Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        {success && (
                            <Alert variant="filled" severity="success">
                                Sign Up Successful!
                            </Alert>
                        )}
                        {/*  Error Message */}
                        {error && (
                            <Alert variant="filled" severity="error">
                                {error}
                            </Alert>
                        )}
                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold rounded-lg py-2.5 text-sm transition-all"
                        >
                            Sign up
                        </button>
                    </form>
                </div>

                {/* Login link */}
                <p className="text-center text-sm text-gray-500 mt-5">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
                        Log in
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;
