import React from "react";

const Footer = () => {
  return (
    <footer
      className="bg-white border-t border-gray-200 px-4 py-3"
      style={{ boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.05)" }} // lighter top-only shadow
    >
      <p className="mb-1 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} SerenScribe. All rights reserved.
      </p>
      <p className="text-sm text-gray-500">
        Built with 💙 using React, Tailwind CSS & Appwrite.
      </p>
    </footer>
  );
};

export default Footer;
