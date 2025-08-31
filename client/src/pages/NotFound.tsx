import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold text-error !mb-4">404</h1>
        <h2 className="text-2xl font-semibold !mb-4">Page Not Found</h2>
        <p className="text-base-content/70 !mb-8">
          Sorry, we couldn't find the page you're looking for. The page might
          have been removed or the link might be broken.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn btn-primary w-24" onClick={() => navigate(-1)}>
            Go Back
          </button>
          <button className="btn btn-secondary w-24" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
