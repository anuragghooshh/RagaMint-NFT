import { removeLocalStorageItem, setLocalStorageItem } from '@/utils/localStorageUtils';

export const setMethod = method => {
  setLocalStorageItem('method', method);
};

export const getMethod = () => {
  if (typeof window === 'undefined') return null;
  const method = localStorage.getItem('method');
  if (!method) {
    return null;
  }
  return JSON.parse(method);
};

export const removeMethod = () => removeLocalStorageItem('method');
