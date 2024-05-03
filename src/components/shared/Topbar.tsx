import React from 'react';
import { Link, useNavigate } from "react-router-dom";

import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { Button } from "../ui/button";
import { INITIAL_USER, useUserContext } from "@/context/AuthContext";
import Loader from "./Loader";

const Topbar = () => {
  const { mutate: signOut } = useSignOutAccount();
  const navigate = useNavigate();

  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);

    navigate('/sign-in');
  };

  return (
    <section className="topbar">
      <div className="flex-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/images/logo.svg" alt="logo" width={130} height={325} />
        </Link>

        {isLoading ? <Loader /> : (
          <div className="flex gap-4">
            <Button
              onClick={(e) => handleSignOut(e)}
              variant="ghost"
              className="shad-button_ghost"
            >
              <img src="/assets/icons/logout.svg" alt="logout" width={24} height={24} />
            </Button>
            <Link to={`/profile/${user.id}`} className="flex-center gap-3">
              <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Topbar;