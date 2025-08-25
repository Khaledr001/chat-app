import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await signup({
        name: formData.name,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-blue-900 px-4 py-8">
      <div className="bg-gray-800/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center tracking-tight">
          Sign Up
        </h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-3 mb-5 text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
              Username
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
              placeholder="Create a password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/80 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
              placeholder="Re-enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-8 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
