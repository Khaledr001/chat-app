import { useEffect, useState } from "react";
import type { IUser } from "../../shear/types/userType";
import { ArrowRightCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setDetails } from "../../redux/reducers/chatLayout.reducer";

const RightSidebar = () => {
  const [user, setUser] = useState<IUser | null>(null);

  const { showDetails } = useSelector((state: any) => state.chatLayout);

  const dispatch = useDispatch()

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user ? JSON.parse(user) : null);
  }, []);

  return (
    <div className="!p-1 w-auto md:w-64 lg:w-96 xl:w-100 bg-base-100 border-l-2 border-base-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-end border-b border-base-300">
        <h3 className="text-xl w-[90%] font-semibold text-center !pt-3 h-[55px]">
          Detail Information
        </h3>
        <button
          onClick={() => {
            dispatch(setDetails(!showDetails));
          }}
          className="btn btn-sm btn-circle md:hidden">
          <ArrowRightCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Individual Information */}
      <div className="text-center !m-5">
        <div className="avatar">
          <div className="ring-info ring-offset-base-100 ring-2 ring-offset-2 w-20 rounded-full">
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
