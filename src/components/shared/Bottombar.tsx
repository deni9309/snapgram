import { Link, useLocation } from "react-router-dom";

import { bottombarLinks } from "@/constants";

const Bottombar = () => {
  const { pathname } = useLocation();

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link, index) => {
        const isActive = link.route === pathname;

        return (
          <Link key={index} to={link.route} className={`flex-center flex-col gap-1 p-2 transition ${isActive && 'bg-primary-500 rounded-[10px]'}`}>
            <img src={link.imgUrl} alt={link.label} width={16} height={16} className={`${isActive && 'invert-white'}`} />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;