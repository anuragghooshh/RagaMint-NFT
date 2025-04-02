import React from "react";
import Navbar from "../navbar/Navbar";
import ConnectMetamaskWallet from "../auth/ConnectMetamaskWallet";
import Footer from "../footer/Footer";

const RootLayout = ({ children }) => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gray-950">
      {/* Cyber grid background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.25) 1px, transparent 0px),
              linear-gradient(to right, rgba(147, 51, 234, 0.25) 1px, transparent 0px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.15) 2px, transparent 2px),
              linear-gradient(to right, rgba(59, 130, 246, 0.15) 2px, transparent 2px)
            `,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none bg-scan-lines opacity-10"></div>

      <div className="w-full fixed min-h-screen top-0 left-0 z-0 overflow-hidden">
        <div className="relative w-full h-full">
          <div className="size-96 bg-purple-600/20 blur-[120px] absolute -top-20 -left-40 animate-pulse-slow" />
          <div className="size-96 bg-blue-600/20 blur-[120px] absolute top-60 -right-40 animate-pulse-slower" />
          <div className="size-[32rem] bg-cyan-600/20 blur-[120px] absolute top-[40rem] -left-40 animate-pulse-slow" />
          
          <div className="size-72 bg-purple-500/5 blur-[80px] absolute top-1/4 left-1/3 animate-float" />
          <div className="h-[1px] w-screen bg-gradient-to-r from-transparent via-purple-500/50 to-transparent absolute top-10 left-0" />
          <div className="h-[1px] w-screen bg-gradient-to-r from-transparent via-blue-500/50 to-transparent absolute bottom-20 left-0" />
        </div>
      </div>
      <ConnectMetamaskWallet />
      <div className="container w-full mx-auto relative pt-2 md:pt-3 lg:pt-5 z-20 px-5">
        <Navbar />
        <div className="w-full relative z-20">
          {children}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default RootLayout;