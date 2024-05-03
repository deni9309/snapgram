import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";

import { INITIAL_USER, useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { sidebarLinks } from "@/constants";
import { TNavLink } from "@/types";
import { Button } from "../ui/button";
import Loader from "./Loader";

const LeftSidebar = () => {
  const { mutate: signOut } = useSignOutAccount();
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    
    navigate('/sign-in');
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11 ">
        <Link to="/" className="flex items-center gap-3 max-w-[270px]">
          <img src="/assets/images/logo.svg" alt="logo" width={170} height={36} />
        </Link>

        {isLoading || !user.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold flex-wrap">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: TNavLink, index) => {
            const isActive = link.route === pathname;

            return (
              <li key={`${index}${link.label}`} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                <NavLink to={link.route} className="flex items-center gap-4 p-4">
                  <img src={link.imgUrl} alt={link.label} className={`group-hover:invert-white ${isActive && 'invert-white'}`} />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}
      >
        <img src="/assets/icons/logout.svg" alt="logout" width={24} height={24} />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;