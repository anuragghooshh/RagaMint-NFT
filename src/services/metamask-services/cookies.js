import cookies from 'js-cookie';

export const setMethod = (method, expiry) => {
  cookies.set('method', JSON.stringify({ value: method, expiry }), {
    expires: 365 * 10,
    secure: true
  });
};

export const getMethod = () => {
  const cookie = cookies.get('method');
  if (!cookie) {
    return null;
  }
  try {
    return JSON.parse(cookie);
  } catch (error) {
    console.log(error);
  }
};

export const removeMethod = () => cookies.remove('method');