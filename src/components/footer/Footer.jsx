import React from "react";
import { Github, Code, Mail, Linkedin, HeartIcon } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-20 border-t border-purple-500/10 bg-violet-400/10 backdrop-blur-sm pt-10 pb-8 relative z-30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-syncopate bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 mb-3">
              Raga<span className="font-bold">Mint</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              A platform to deploy and mint NFTs on the Ethereum blockchain and
              then, On OpenSea.
            </p>
            <div className="flex space-x-4">
              <Link
                title="GitHub"
                href="https://github.com/anuragghooshh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github size={18} />
              </Link>
              <Link
                title="LinkedIn"
                href="https://www.linkedin.com/in/anuragghoshh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                title="Email"
                href="mailto:anuragghosh66@gmail.com"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Mail size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Create NFT
                </Link>
              </li>
              <li>
                <Link
                  href="/nfts"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  My Collection
                </Link>
              </li>
              <li>
                <a
                  href="https://ethereum.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Learn about Ethereum
                </a>
              </li>
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h4 className="text-white font-semibold mb-3">
              Developer Information
            </h4>
            <ul className="space-y-1.5 text-sm text-gray-400">
              <li>
                <span className="text-gray-300 font-medium">Name:</span> Anurag
                Ghosh
              </li>
              <li>
                <span className="text-gray-300 font-medium">Enrollment:</span>{" "}
                A914145023042
              </li>
              <li>
                <span className="text-gray-300 font-medium">Programme:</span>{" "}
                MCA
              </li>
              <li>
                <span className="text-gray-300 font-medium">University:</span>{" "}
                Amity University, Kolkata
              </li>
            </ul>
            <div className="flex items-center mt-4 space-x-2">
              <Code size={14} className="text-purple-400" />
              <span className="text-xs text-gray-400">
                Major Project (NTCC) - 2025
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-gray-800 flex justify-between flex-col md:flex-row items-center">
          <div className="text-gray-400 text-sm mb-3 md:mb-0">
            © {currentYear} RagaMint. All rights reserved.
          </div>

          <p className="text-gray-400 font-syncopate text-xs flex items-center gap-2">
            {" "}
            Made with{" "}
            <span>
              <HeartIcon size={14} className="text-red-500" />
            </span>{" "}
            by Anurag Ghosh{" "}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
    </footer>
  );
};

export default Footer;
