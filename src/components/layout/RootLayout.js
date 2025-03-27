import React from "react";
import Navbar from "../navbar/Navbar";
import ConnectMetamaskWallet from "../auth/ConnectMetamaskWallet";

const RootLayout = ({ children }) => {
  return (
    <div className="w-full px-5">
      <div className="container w-full mx-auto relative  pt-2 md:pt-3 lg:pt-5">
        <Navbar />
        <ConnectMetamaskWallet />
        <div className="w-full relative z-20">{children}</div>
        <div className="w-full fixed min-h-screen top-0 left-0 z-10 overflow-hidden">
          <div className="relative w-full h-full">
            <div className="size-72 bg-[#3b388bc0] blur-3xl absolute top-0 -left-40" />
            <div className="size-72 bg-[#3b388b] blur-3xl absolute top-48 -right-40" />
            <div className="size-[32rem] bg-[#3b388b5d] blur-3xl absolute top-[36rem] -left-40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
