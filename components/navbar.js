import Link from "next/link";
import styles from "@/styles/navbar.module.css";
import { FaGithub } from "react-icons/fa";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], weight: "400" });

const Navbar = () => {
  return (
    <div>
      <div
        className={`${styles.my_navbar} navbar bg-base-100 fixed top-0 min-h-12`}
      >
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl nav_btn_height">
            AU Federal Elections 2022
          </Link>
        </div>
        <div className="flex-none">
          {/* <Link href="/about" className="btn btn-ghost px-2 nav_btn_height">
            About
          </Link> */}

          <a
            href="https://github.com/Stefano-Civelli/facebook_ads_react"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost px-2 mr-4 nav_btn_height flex items-center"
          >
            <FaGithub />
            GitHub
          </a>
        </div>
      </div>
      <div className="h-12 w-full"></div>
    </div>
  );
};

export default Navbar;
