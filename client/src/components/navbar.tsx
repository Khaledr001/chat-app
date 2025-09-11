import { LogOut, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../api/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLazyGetNotFriendsQuery } from "../redux/api/api.rtk";
import NotFriendCard from "./notFriend";
import NotificationContant from "./notification";
import { unsetUser } from "../redux/reducers/auth.reducer";

const NavBar = () => {
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [notFriends, setNotFriends] = useState<any[]>([]);

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (!res) {
        throw new Error("Logout failed");
      }
      toast.success("Logout successful!");

      // remove user jwt token
      localStorage.clear();
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch(unsetUser());

      navigate("/login");
      navigate(0);
    } catch (error: any) {
      toast.error(error?.message || "Logout failed!");
    }
  };

  const [fetchNotFriends, { isLoading: isLoadingNotFriends }] =
    useLazyGetNotFriendsQuery();

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      console.log("Search Value:", searchValue);
      fetchNotFriends(searchValue)
        .then(({ data }: any) => {
          console.log("Not Friends:", data);
          setNotFriends(data.users);
        })
        .catch((error) => {
          console.error("Error fetching not friends:", error);
        });
    }, 1000);

    return () => clearTimeout(timeOutId);
  }, [searchValue]);

  return (
    <>
      <div className="navbar !h-[3rem] bg-base-100 border-b border-b-base-300 shadow-2xl !px-5">
        <div className="navbar-start">
          <div className="flex items-center justify-between">
            {/* Avatar + Info */}
            <div className="flex items-center">
              <div className="avatar !mx-2 !my-3">
                <div className="ring-primary ring-offset-base-100 w-9 sm:w-10 md:w-11 rounded-full ring-1 ring-offset-1">
                  <img
                    src={
                      user?.avatar?.url
                        ? `http://localhost:3100/${user?.avatar?.url}`
                        : "../../public/image/default_image.png"
                    }
                  />
                </div>
              </div>
              {user && (
                <div className="!mt-2 !mx-1.5">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-base-content/50">
                    {user.userName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="navbar-end gap-3">
          <button
            onClick={() =>
              (
                document?.getElementById("searchModal") as HTMLDialogElement
              )?.showModal()
            }
            className="btn btn-ghost btn-circle">
            <Search className="w-4 sm:w-5 md:w-6" />
          </button>

          {/* Notification Button */}
          <NotificationContant />

          {/* Logout Button */}
          <div className="tooltip tooltip-bottom">
            <div className="tooltip-content ">
              <div className="animate-bounce text-orange-400 -rotate-10 text-lg font-black">
                LogOut!
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="btn btn-ghost hover:btn-error btn-circle">
              <LogOut className="w-4 sm:w-5 md:w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal  */}
      <dialog id="searchModal" className="modal">
        <div className="modal-box !p-7 min-h-[400px] max-w-[450px]">
          <div className="flex flex-col  items-center">
            <label className="input w-full !mt-5 focus-within:outline-none !px-2">
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
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className=""
                required
                placeholder="Search"
              />
            </label>
          </div>

          <div className="">
            {notFriends.length > 0
              ? notFriends.map((user, index) => (
                  <div key={index} className="!m-2">
                    <NotFriendCard user={user} />
                  </div>
                ))
              : null}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <dialog open className="modal">
          <div className="modal-box !p-6 !rounded-lg">
            <h3 className="font-bold text-lg">Confirm Logout!</h3>
            <p className="!py-2">Are you sure you want to log out?</p>
            <div className="modal-action !pt-10">
              <button
                onClick={handleLogout}
                className="btn btn-error !px-3 !mx-3">
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="btn btn-info !px-3">
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default NavBar;
