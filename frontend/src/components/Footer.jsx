import React from "react";
import { FaGithub, FaRegCopyright } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t mt-10 py-4 bg-background">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <div className="flex items-center space-x-2">
          <FaRegCopyright className="inline-block" />
          <span>2025 Choun Chan Nirak</span>
        </div>
        <Link
          to="https://github.com/nirakchoun"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 sm:mt-0 flex items-center space-x-1 hover:text-primary transition-colors"
        >
          <FaGithub className="size-5" />
          <span>GitHub</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
