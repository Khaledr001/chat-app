import ChatLoader from "./chatLoader";

const LayoutLoader = () => {
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Navbar */}
      <div className="h-14 border-b border-base-300 !px-4 flex items-center gap-3 bg-base-200">
        <div className="skeleton w-10 h-10 rounded-full bg-gray-600"></div>
        <div className="skeleton h-5 w-40 bg-gray-600"></div>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-base-300 !p-4 flex flex-col gap-4 bg-base-100">
          <div className="skeleton h-10 w-full bg-gray-600"></div>
          <div className="skeleton h-10 w-full bg-gray-600"></div>
          <div className="skeleton h-10 w-full bg-gray-600"></div>
          <div className="skeleton h-10 w-full bg-gray-600"></div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-base-100">
          {/* Chat Header */}
          <div className="h-14 border-b border-base-300 !px-4 flex items-center gap-3">
            <div className="skeleton h-5 w-40 bg-gray-600"></div>
          </div>

          {/* Chat Messages */}
          <ChatLoader />

          {/* Chat Input */}
          <div className="h-16 border-t border-base-300 !px-4 flex items-center gap-2">
            <div className="skeleton h-10 w-full rounded-full bg-gray-600"></div>
            <div className="skeleton h-10 w-10 rounded-full bg-gray-600"></div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 border-l border-base-300 !p-4 flex flex-col gap-4 bg-base-100">
          <div className="skeleton h-24 w-full rounded-xl bg-gray-600"></div>
          <div className="skeleton h-10 w-3/4 bg-gray-600"></div>
          <div className="skeleton h-10 w-2/3 bg-gray-600"></div>
          <div className="skeleton h-10 w-1/2 bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default LayoutLoader;
