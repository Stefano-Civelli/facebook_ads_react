import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center uq-color text-primary-content p-10 relative z-10">
      <aside>
        <p>© {new Date().getFullYear()} - Licensed under AGPL-3.0</p>
      </aside>
    </footer>
  );
};

export default Footer;
