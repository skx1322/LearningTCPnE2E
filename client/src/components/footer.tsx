import { Link } from "react-router";
import { headerData } from "../data/componentData";

const Footer = () => {
  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText("healthxaxis@gmail.com");
  // };

  return (
    <footer>
      <section className="text-center">
        <p className="text-2xl">chatme.com</p>
        <p className="text-2xl">
          Learning TCP with Chat System and End 2 End Encryption.
        </p>
      </section>
      <section className="grid grid-cols-3">
        {headerData.map((data, index) => (
          <span className="flex flex-col items-center justify-center">
            {data.icons()}
            <Link
              to={data.link}
              key={index}
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
                                location.pathname === data.link
                                  ? "text-green"
                                  : "text-green-600"
                              }
                            `}
            >
              {data.title}
            </Link>
          </span>
        ))}
      </section>
    </footer>
  );
};

export default Footer;
