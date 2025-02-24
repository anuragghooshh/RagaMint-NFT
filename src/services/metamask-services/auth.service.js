import { ethers } from 'ethers';
// ../../../public/favicon-32x32.png

export const connectMetamaskWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
    const errorMessage = isMobile ? "Use Metamask's in-app browser or desktop extension." : 'Install MetaMask extension first.';
    throw new Error(errorMessage);
  }

  try {
    let provider = window.ethereum.providers?.find(p => p.isMetaMask) || window.ethereum;

    await provider.request({ method: 'eth_requestAccounts' });
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    return signer;
  } catch (error) {
    throw new Error('Please log in to your MetaMask extension.');
  }
};
