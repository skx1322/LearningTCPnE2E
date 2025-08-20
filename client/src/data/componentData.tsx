import { FaInfoCircle, FaPlus, FaUser } from "react-icons/fa";

export const headerData = [
  {
    title: "login",
    link: "/",
    icons: function () {
      return (
        <FaUser
          className={`
                              px-4
                              text-2xl
                              transform
                              transition
                              duration-500
                              ease-in-out
                              hover:scale-105
                              hover:text-black
                              ${
                                location.pathname === this.link
                                  ? "text-green"
                                  : "text-green-600"
                              }
                            `}
        />
      );
    },
  },
  {
    title: "register",
    link: "/register",
    icons: function () {
      return (
        <FaPlus
          className={`
                              px-4
                              text-2xl
                              transform
                              transition
                              duration-500
                              ease-in-out
                              hover:scale-105
                              hover:text-black
                              ${
                                location.pathname === this.link
                                  ? "text-green"
                                  : "text-green-600"
                              }
                            `}
        />
      );
    },
  },
  {
    title: "about",
    link: "/about",
    icons: function () {
      return (
        <FaInfoCircle 
          className={`
                              px-4
                              text-2xl
                              transform
                              transition
                              duration-500
                              ease-in-out
                              hover:scale-105
                              hover:text-black
                              ${
                                location.pathname === this.link
                                  ? "text-green"
                                  : "text-green-600"
                              }
                            `}
        />
      );
    },
  },
];
