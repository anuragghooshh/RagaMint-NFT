import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useFirebaseAuth from "@/services/firebase-services/useFirebaseAuth";
import { useRouter } from "next/navigation";
import {
  setToken,
  setUser,
  getToken,
} from "@/services/firebase-services/cookies";
import { showSuccessMessage, showErrorMessage } from "@/utils/toast";
import { Sparkles, Loader2, Loader, HeartIcon } from "lucide-react";

const GoogleIcon = () => {
  return (
    <div className="size-7 aspect-square grid place-items-center rounded-full bg-white">
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="group-hover:rotate-[360deg] duration-500 transition-transform ease-[cubic-bezier(0.4, 0, 0.2, 1)]"
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
    </div>
  );
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.status) {
        setToken(result.token, result.expiryTime);
        setUser(result.user);
        showSuccessMessage("Logged in successfully!");
        router.push("/");
      } else {
        showErrorMessage(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      showErrorMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-gray-900/60 border border-gray-800 rounded-xl p-8 shadow-2xl transition-all hover:border-purple-500/30">
          <div className="text-center mb-8">
            <h1 className="text-sm md:text-base font-light tracking-tight mb-2 text-gray-400">
              Welcome to{" "}
              <span className="text-2xl sm:text-3xl font-syncopate block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Raga<span className="font-bold">Mint</span>
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              Sign in to start deploying your NFTs
            </p>
          </div>

          <div className="space-y-6">
            <div className="aspect-square relative overflow-hidden rounded-xl mb-6">
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center p-4">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-500/50" />
                  <p className="text-gray-300 text-lg font-light">
                    NFT Deployment Platform
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Create, deploy and overlook NFTs with ease
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full cursor-pointer group h-12 flex items-center justify-center gap-3 bg-violet-400/20 hover:bg-violet-400/70 text-white border border-violet-400/50 rounded-lg transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <GoogleIcon />
                  Sign in with Google
                </>
              )}
            </Button>
            <p className="text-gray-400 w-fit font-syncopate text-xs flex items-center gap-2 mx-auto ">
              {" "}
              Made with{" "}
              <span>
                <HeartIcon size={14} className="text-red-500" />
              </span>{" "}
              by Anurag Ghosh{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
