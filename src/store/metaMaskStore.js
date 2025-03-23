import { create } from 'zustand';

const useMetamaskStore = create((set, get) => ({
  signer: null,
  toConnect: false,

  setWalletAddress: signer => {
    set({ signer });
  },

  setToConnect: val => {
    set({ toConnect: val });
  },

  clearWalletAddress: () => {
    set({ signer: null });
  },

  checkMetamaskConnection: () => {
    const { signer, setToConnect } = get();
    if (!signer) {
      setToConnect(true);
      return false;
    }
    return true;
  }
}));

export default useMetamaskStore;
