import "@/styles/globals.css";
import { Inter, Syncopate } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Head from "next/head";

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
  return (
    <>
      <Head>
        <title>Veelive</title>
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
