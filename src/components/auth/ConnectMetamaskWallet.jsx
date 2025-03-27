import React from "react";
import {
  showErrorMessage,
  showInfoMessage,
  showSuccessMessage,
} from "@/utils/toast";
import { setMethod } from "@/services/metamask-services/cookies";
import { connectMetamaskWallet } from "@/services/metamask-services/auth.service";
import useMetamaskStore from "@/store/metaMaskStore";
import Tick from "../../../public/icons/misc/Tick";
import { Metamask } from "../../../public/icons/misc/SignInPlatforms";
import Connect from "../../../public/icons/misc/Connect";

const ConnectMetamaskWallet = ({ postAction }) => {
  const { setWalletAddress, signer } = useMetamaskStore();

  const connect = async () => {
    if (signer) {
      showInfoMessage("Metamask already connected");
      return;
    } else {
      try {
        const signer = await connectMetamaskWallet();
        setWalletAddress(signer);
        setMethod("metamask");
        showSuccessMessage("Metamask connected");
      } catch (error) {
        showErrorMessage("Error connecting Metamask");
      } finally {
        postAction && postAction();
      }
    }
  };

  return (
    <div className="h-fit flex items-center fixed bottom-2 md:top-36 right-0 translate-x-[calc(100%-48px)] hover:translate-x-0 transition-all duration-300 ease-in-out z-50">
      <div className={`size-10 min-w-10 rounded-full grid place-items-center ${signer ? 'bg-green-500' : 'bg-gray-800'}`}>
        <Metamask />
      </div>
      <div className={` size-4 rounded-full ${signer ? 'bg-green-500' : 'bg-gray-800'}`} />
      <button disabled={signer} type="button" title={signer ? 'Connected' : 'Connect with Metamask Wallet'} onClick={connect} className={`flex items-center gap-3 justify-between p-2 px-3 rounded-l-xl text-paragraph-15 font-inter_tight font-bold ${signer ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-gray-800 text-white cursor-pointer'}`}>
        <div className="flex items-center gap-[10px]">{signer ? 'Connected' : 'Metamask'}</div>
        <div className={`min-w-[33px] h-[33px] grid place-items-center rounded-lg bg-grafity-middle-2`}>{signer ? <Tick /> : <Connect />}</div>
      </button>
    </div>
  );
};

export default ConnectMetamaskWallet;
