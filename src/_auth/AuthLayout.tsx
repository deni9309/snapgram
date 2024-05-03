import { useUserContext } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-col flex-1 justify-center items-center py-10">
            <Outlet />   {/* renders the content here */}
          </section>

          <img
            src="/assets/images/side-img.svg"
            alt="logo"
            className="hidden xl:block w-1/2 h-screen object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;