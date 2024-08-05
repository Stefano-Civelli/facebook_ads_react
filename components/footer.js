import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="footer footer-center uq-color text-primary-content p-10">
      <aside>
        <Image
          src="/uq-logo-white.svg"
          alt="University Logo"
          width={200}
          height={100}
          className="inline-block fill-current mb-1"
        />
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
    </footer>
  );
};

export default Footer;
