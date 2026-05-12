import axios from "../api/axios";
import Button from "./Button";
import { BiTask } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../redux/features/auth/authSlice";
import { LogOut, User } from "lucide-react";

const logoutUser = async () => {
  const { data } = await axios.post("/api/v1/user/logout");
  return data;
};

const Header = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.auth.userInfo);

  const isLoginPage = window.location.pathname === "/login";
  const isSignupPage = window.location.pathname === "/signup";

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(logout());
      queryClient.setQueryData(["user"]);
      toast.success("Logout successful");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    },
  });

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to={"/"} className="flex items-center gap-3 group">
            <div className="bg-white p-2 rounded-xl group-hover:scale-110 transition-transform">
              <BiTask className="text-3xl text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-white hidden sm:block">
              Task Manager
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {!userinfo?.email ? (
              <>
                <Link to={"/login"}>
                  <button
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                      isLoginPage
                        ? "bg-white text-blue-600 shadow-lg"
                        : "bg-white bg-opacity-20 text-white hover:bg-white hover:text-blue-600"
                    }`}
                  >
                    Login
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                      isSignupPage
                        ? "bg-white text-blue-600 shadow-lg"
                        : "bg-white bg-opacity-20 text-white hover:bg-white hover:text-blue-600"
                    }`}
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-xl text-white">
                  <User size={18} />
                  <span className="font-medium">
                    {userinfo.firstname} {userinfo.lastname}
                  </span>
                </div>
                <button
                  onClick={() => mutation.mutate()}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
