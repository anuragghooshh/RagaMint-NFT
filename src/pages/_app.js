import "@/styles/globals.css";
import { Inter, Syncopate } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import { connectMetamaskWallet } from "@/services/metamask-services/auth.service";
import useMetamaskStore from "@/store/metaMaskStore";
import { getMethod } from "@/services/metamask-services/cookies";
import React from "react";
import { showErrorMessage } from "@/utils/toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-syncopate",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const { signer, setWalletAddress } = useMetamaskStore();

  React.useEffect(() => {
    const method = getMethod();

    if (!signer && method?.value === "metamask") {
      connectMetamaskWallet() // Returns Signer
        .then((signer) => {
          console.log(signer);
          if (signer) setWalletAddress(signer); // Set Signer State
        })
        .catch((e) => {
          showErrorMessage(e.message);
        });
    }
  }, []);

  return (
    <>
      <Head>
        <title>RagaMint</title>
      </Head>
      <main
        className={`${inter.variable} ${syncopate.variable} relative max-w-[1920px] mx-auto`}
      >
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </main>
    </>
  );
}
