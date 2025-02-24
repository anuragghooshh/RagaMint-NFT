import cookies from 'js-cookie';

export const setToken = (token, expiry) => {
  cookies.set('token', JSON.stringify({ value: token, expiry }), {
    expires: 365 * 10,
    secure: true
  });
};

export const getToken = () => {
  const cookie = cookies.get('token');
  if (!cookie) {
    return null;
  }
  return cookie;
};

export const removeToken = () => cookies.remove('token');

export const setUser = (user, expiry) => {
  cookies.set('user', JSON.stringify(user), {
    expires: 365 * 10,
    secure: true
  });
};

export const getUser = () => {
  const cookie = cookies.get('user');
  if (!cookie) {
    return null;
  }
  try {
    return JSON.parse(cookie);
  } catch (e) {
    console.log(e);
  }
};

export const removeUser = () => cookies.remove('user');
