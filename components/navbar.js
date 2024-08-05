import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          AU Federal Elections 2022
        </Link>
      </div>
      <div className="flex-none">
        <Link href="/about" className="btn btn-ghost px-2">
          About
        </Link>
        <button className="btn btn-ghost px-2 mr-4">
          <FaGithub />
          GitHub
        </button>
      </div>
    </div>
  );
};

export default Navbar;
