import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/auth.api";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await loginUser({ userName, password });
      if (!data) {
        setError({ message: "Login failed. Please check your credentials." });
        throw new Error("Login failed");
      }

      setIsLoading(false);
      console.log(data);

      toast.success("Login successful!");

      navigate("/");
      navigate(0);

    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-blue-900 px-4 py-8">
      <div className="bg-gray-800/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full min-h-[450px] max-w-md border border-gray-700 flex flex-col justify-center gap-4">
        <h2 className="text-3xl font-extrabold text-white !mb-8 text-center tracking-tight">
          Login
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-7 !p-5">
          <label
            htmlFor="userName"
            className="floating-label !px-2 input input-lg input-info w-full validator">
            <span> User Name </span>
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
              type="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              // className="input input-lg input-info"
              placeholder="Enter your username"
              // pattern="[A-Za-z][A-Za-z0-9\-!@]*"
              minLength={3}
              maxLength={30}
              title="Minimum 3 characters, maximum 30 characters"
              required
            />
          </label>

          <label
            htmlFor="password"
            className="floating-label !px-2 input input-lg w-full input-info">
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // className="input input-lg input-info"
              placeholder="Enter your password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-secondary btn-lg btn-block mt-2">
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className="mt-8 text-center text-gray-400 text-md">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
