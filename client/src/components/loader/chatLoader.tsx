const ChatLoader = () => {
  return (
    <div className="flex w-full h-full flex-col gap-8 !pt-7 !p-4 overflow-y-auto">
      {/* Incoming message (left) */}
      <div className="flex items-start gap-2">
        <div className="skeleton w-10 h-10 rounded-full bg-gray-600"></div>
        <div className="skeleton h-12 w-40 rounded-2xl bg-gray-600"></div>
      </div>

      {/* Outgoing message (right) */}
      <div className="flex items-start gap-2 justify-end">
        <div className="skeleton h-10 w-32 rounded-2xl bg-gray-600"></div>
        <div className="skeleton w-10 h-10 rounded-full bg-gray-600"></div>
      </div>

      {/* Another incoming message */}
      <div className="flex items-start gap-2">
        <div className="skeleton w-10 h-10 rounded-full bg-gray-600"></div>
        <div className="skeleton h-16 w-56 rounded-2xl bg-gray-600"></div>
      </div>

      {/* Another outgoing message */}
      <div className="flex items-start gap-2 justify-end">
        <div className="skeleton h-12 w-44 rounded-2xl bg-gray-600"></div>
        <div className="skeleton w-10 h-10 rounded-full bg-gray-600"></div>
      </div>

      {/* Another incoming message */}
      <div className="flex items-start gap-2">
        <div className="skeleton w-10 h-10 rounded-full bg-gray-600"></div>
        <div className="skeleton h-12 w-40 rounded-2xl bg-gray-600"></div>
      </div>

      {/* Outgoing message (right) */}
      <div className="flex items-start gap-2 justify-end">
        <div className="skeleton h-10 w-32 rounded-2xl bg-gray-600"></div>
        <div className="skeleton w-10 h-10 rounded-full bg-gray-600"></div>
      </div>

      {/* Another incoming message */}
      <div className="flex items-start gap-2">
        <div className="skeleton w-10 h-10 rounded-full bg-gray-600"></div>
        <div className="skeleton h-16 w-56 rounded-2xl bg-gray-600"></div>
      </div>

      {/* Another outgoing message */}
      <div className="flex items-start gap-2 justify-end">
        <div className="skeleton h-12 w-44 rounded-2xl bg-gray-600"></div>
        <div className="skeleton w-10 h-10 rounded-full bg-gray-600"></div>
      </div>
    </div>
  );
};

export default ChatLoader;
