import { useEffect, useState } from "react";
import type { IUser } from "../../shear/types/userType";


const RightSidebar = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user ? JSON.parse(user) : null);
  }, []);

  return (
    <div className="w-80  bg-base-100 border-l border-base-300 p-4">
      <h3 className="text-xl font-semibold text-center !my-5 ">
        Detail Information
      </h3>

      {/* Individual Information */}
      <div className="text-center !mb-6">
        <div className="avatar">
          <div className="w-20 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/idiotsandwich@192.webp" />
          </div>
        </div>
        <h4 className="font-semibold text-lg !mt-2"> {user?.name} </h4>
        <p className="">{user?.userName}</p>
        <p>{user?.email}</p>
      </div>

      {/* Members */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">Member</span>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
