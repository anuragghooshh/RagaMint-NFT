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
    <button
      disabled={signer}
      type="button"
      title={signer ? "Connected" : "Connect with Metamask Wallet"}
      onClick={connect}
      className={`flex items-center gap-3 justify-between p-2 rounded-xl text-base font-bold cursor-pointer ${
        signer
          ? "bg-green-500 text-gray-800"
          : "bg-gray-700 text-white"
      }`}
    >
      <div className="flex items-center gap-[10px]">
        <div
          className={`min-w-[33px] h-[33px] grid place-items-center bg-[#DBD4CD] rounded-lg`}
        >
          <Metamask />
        </div>
        {signer ? "Connected" : "Metamask"}
      </div>
      <div
        className={`min-w-[33px] h-[33px] grid place-items-center rounded-lg bg-gray-800`}
      >
        {signer ? <Tick /> : <Connect />}
      </div>
    </button>
  );
};

export default ConnectMetamaskWallet;
