import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Sparkles, Grid3X3, LogOut, Menu, X } from "lucide-react";
import ConnectMetamaskWallet from "@/components/auth/ConnectMetamaskWallet";
import useFirebaseAuth from "@/services/firebase-services/useFirebaseAuth";

export default function Navbar() {
  const router = useRouter();
  const { logOut } = useFirebaseAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [router.asPath]);

  const isActive = (path) => router.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full px-3 py-3">
      <div className="w-full rounded-2xl backdrop-blur-lg bg-gray-900/70 border border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <h2 className="cursor-pointer text-2xl font-syncopate font-extralight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                Raga<span className="font-bold">Mint</span>
              </h2>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                href="/"
                className={`px-4 py-2 rounded-md text-base font-medium transition duration-300 ${
                  isActive("/")
                    ? "bg-purple-700/20 text-purple-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={18} />
                  Create
                </span>
              </Link>

              <Link
                href="/nfts"
                className={`px-4 py-2 rounded-md text-base font-medium transition duration-300 ${
                  isActive("/nfts")
                    ? "bg-purple-700/20 text-purple-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Grid3X3 size={18} />
                  My NFTs
                </span>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={logOut}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                <LogOut size={18} className="mr-1" />
                Logout
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              <ConnectMetamaskWallet />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="ml-3 text-gray-300 hover:text-white transition duration-300"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="container mx-auto px-4 py-3 space-y-2">
              <Link
                href="/"
                className={`block px-4 py-2 rounded-md text-base font-medium transition duration-300 ${
                  isActive("/")
                    ? "bg-purple-700/20 text-purple-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={18} />
                  Create NFT
                </span>
              </Link>

              <Link
                href="/nfts"
                className={`block px-4 py-2 rounded-md text-base font-medium transition duration-300 ${
                  isActive("/nfts")
                    ? "bg-purple-700/20 text-purple-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Grid3X3 size={18} />
                  My NFTs
                </span>
              </Link>

              <button
                onClick={logOut}
                className="w-full text-left block px-4 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition duration-300"
              >
                <span className="flex items-center gap-2">
                  <LogOut size={18} />
                  Logout
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
