import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LucideCamera } from "lucide-react";
import default_image from "../../public/image/default_image.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    avatar: null as File | null,
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<string>("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setFormData({ ...formData, avatar: file });
      };
      reader.readAsDataURL(file);
    }
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
        avatar: formData.avatar,
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
      <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 min-h-[550px] !p-5">
        <h2 className="text-3xl font-extrabold text-white !mt-5 !mb-8 text-center tracking-tight">
          Sign Up
        </h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-3 mb-5 text-sm text-center">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 justify-center items-center">
          <div className="relative w-32 mx-auto !mb-2">
            {/* Avatar */}
            <div className="avatar">
              <div className="mask mask-squircle w-30 border border-gray-300 dark:border-gray-700">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="object-cover" />
                ) : (
                  <img
                    src={default_image}
                    alt="Default Avatar"
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            {/* Upload Button Overlay */}
            <label className="absolute bottom-0 right-1 bg-black/60 hover:bg-black/80 text-white !p-1 rounded-full cursor-pointer shadow-md transition">
              <LucideCamera size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <label
            htmlFor="name"
            className="floating-label !px-2 input input-lg w-full input-info validator">
            <span>Name</span>
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className=""
              placeholder="Enter your name"
              minLength={3}
              maxLength={30}
              title="Name should be 3-30 characters long"
              required
            />
          </label>
          <label
            htmlFor="userName"
            className="floating-label !px-2 input input-lg w-full input-info validator">
            <span>Username</span>
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              id="userName"
              name="userName"
              type="text"
              value={formData.userName}
              onChange={handleChange}
              className=""
              placeholder="Enter your username"
              minLength={3}
              maxLength={30}
              title="Username should be 3-30 characters long"
              required
            />
          </label>
          <label
            htmlFor="email"
            className="floating-label !px-2 input input-lg w-full input-info validator">
            <span>Email</span>
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              placeholder="mail@example.com"
              onChange={handleChange}
              required
            />
          </label>
          <label
            htmlFor="password"
            className="floating-label !px-2 input input-lg w-full input-info validator">
            <span>Password</span>
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor">
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              // className="input input-lg input-info"
              minLength={4}
              title="Password should be at least 4 characters long"
              placeholder="Create a password"
              required
            />
          </label>

          <label
            htmlFor="confirmPassword"
            className="floating-label !px-2 input input-lg w-full input-info validator">
            <span>Confirm Password</span>
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor">
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              // className="input input-lg input-info"
              minLength={4}
              title="Password should be at least 4 characters long"
              placeholder="Create a password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-lg btn-secondary btn-block">
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <p className="!mt-5 text-center text-gray-400 text-md ">
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

export default Signup;
