import Image from "next/image";
import React from "react";
import sandboxLogo from "@/assets/sandbox-logo.png";

const FundingLogos: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center">
      <span className="mr-2 text-gray-700">Backed by:</span>
      <a
        href="https://sandbox.mit.edu/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={sandboxLogo}
          alt="Sandbox Logo"
          width={100}
          height={100}
          className="opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
      </a>
    </div>
  );
};

export default FundingLogos;
