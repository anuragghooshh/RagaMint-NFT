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
    <header className="sticky top-0 z-50 w-full py-3">
      <div className="w-full rounded-2xl backdrop-blur-lg bg-gray-900/70 border border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              title={`RagaMint - "Raga" is derived from "Anurag" which means love, and "Mint" here refers to minting NFTs. When combined, RagaMint means creating NFTs with love and passion.`}
              href="/"
              className="flex items-center space-x-2"
            >
              <h2 className="cursor-pointer text-2xl font-syncopate font-extralight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                Raga<span className="font-bold">Mint</span>
              </h2>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                href="/"
                className={`px-4 py-2 rounded-md font-light uppercase text-sm tracking-wider  transition duration-300 relative ${
                  isActive("/")
                    ? "text-violet-400 after:transition-all after:duration-200 after:ease-in-out hover:after:-translate-x-1 after:size-2 after:bg-violet-400 after:absolute after:rounded-full after:right-0 after:top-1/2 after:-translate-y-1/2 "
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
                className={`px-4 py-2 rounded-md font-light uppercase text-sm tracking-wider  transition duration-300 relative ${
                  isActive("/nfts")
                    ? "text-violet-400 after:transition-all after:duration-200 after:ease-in-out hover:after:-translate-x-1 after:size-2 after:bg-violet-400 after:absolute after:rounded-full after:right-0 after:top-1/2 after:-translate-y-1/2 "
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
                title="Logout"
                onClick={async () => {
                  const res = await logOut();
                  if (res.status) {
                    router.push("/");
                  }
                }}
                className="cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition duration-300"
              >
                <LogOut size={18} className="mr-1" />
                Logout
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="ml-3 cursor-pointer text-gray-300 hover:text-white transition duration-300"
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
          <div className="md:hidden border-t border-gray-800 animate-fadeIn">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link
                href="/"
                className={`block px-4 py-3 rounded-md font-light uppercase text-sm tracking-wider transition duration-300 relative ${
                  isActive("/")
                    ? "text-violet-400 bg-violet-500/10 after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-1/2 after:w-0.5 after:bg-violet-400 after:rounded-r-full"
                    : "text-gray-300 hover:bg-gray-800/40 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Sparkles size={18} className="text-violet-400" />
                  Create NFT
                </span>
              </Link>

              <Link
                href="/nfts"
                className={`block px-4 py-3 rounded-md font-light uppercase text-sm tracking-wider transition duration-300 relative ${
                  isActive("/nfts")
                    ? "text-violet-400 bg-violet-500/10 after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-1/2 after:w-0.5 after:bg-violet-400 after:rounded-r-full"
                    : "text-gray-300 hover:bg-gray-800/40 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Grid3X3 size={18} className="text-violet-400" />
                  My NFTs
                </span>
              </Link>

              <div className="pt-2 border-t border-gray-800/50">
                <button
                  onClick={async () => {
                    const res = await logOut();
                    if (res.status) {
                      router.push("/");
                    }
                  }}
                  className="w-full cursor-pointer text-left block px-4 py-3 rounded-md font-light uppercase text-sm tracking-wider text-gray-300 hover:bg-gray-800/40 hover:text-white transition duration-300"
                >
                  <span className="flex items-center gap-3">
                    <LogOut size={18} className="text-rose-400" />
                    Log Out
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
