import dayjs from 'dayjs';
import { getToken, getUser, setToken } from '../firebase-services/cookies';
import { toast } from 'react-toastify';
import { auth } from '../firebase-services/firebase';
export const URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const getAuthToken = async () => {
  const cookieString = getToken();

  if (cookieString) {
    const { value, expiry } = JSON.parse(cookieString);

    const expiryDate = dayjs(expiry); // When the token will expire
    const currentDate = dayjs(); // Current date and time
    const differenceInMinutes = expiryDate.diff(currentDate, 'minute');

    if (differenceInMinutes <= 15) {
      // Refresh token if it's close to expiration (within 15 mins)
      const refreshedToken = await refreshTokenIfNeeded();
      return refreshedToken || value; // return refreshed token if available, otherwise return current
    }

    return value; // return the current token if not near expiry
  }

  return false; // No token found
};

export const refreshTokenIfNeeded = async () => {
  try {
    const currentUser = await getAuthCurrentUser();
    if (currentUser) {
      const refreshedToken = await currentUser.getIdToken(true);
      const expiryTime = new Date(Date.now() + 3600 * 1000); // Set expiry for 1 hour from now
      setToken(refreshedToken, expiryTime); // Update cookie with new token and expiry
      return refreshedToken;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
  return null; // Return null if token refresh fails
};

// Retry function for getting auth.currentUser with a retry limit
const getAuthCurrentUser = async (retryCount = 5, delay = 2000) => {
  for (let i = 0; i < retryCount; i++) {
    if (auth.currentUser) {
      return auth.currentUser;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  console.warn('auth.currentUser is null after maximum retries');
  return null;
};

export const getUserDetail = () => {
  const cookieString = getUser();
  if (cookieString) {
    return cookieString;
  }
  return false;
};

export const responseValidator = async (response, isToaster = false, message = null) => {
  if (response.ok) {
    const res = await response.json();
    if (Array.isArray(res.data)) {
      if (isToaster) {
        toast.success(!message || message.length == 0 ? res.message : message, {
          toastId: `API-Response-success-${Math.random()}`
        });
      }
      return { status: true, data: [...res.data] };
    } else if (typeof res.data === 'object') {
      if (isToaster) {
        toast.success(!message || message.length == 0 ? res.message : message, {
          toastId: `API-Response-success-${Math.random()}`
        });
      }
      return { status: true, data: res.data };
    } else if (typeof res.data === 'string') {
      if (isToaster) {
        toast.success(!message || message.length == 0 ? res.message : message, {
          toastId: `API-Response-success-${Math.random()}`
        });
      }
      return { status: true, data: res.data };
    } else {
      if (isToaster) {
        toast.success(!message || message.length == 0 ? res.message : message, {
          toastId: `API-Response-success-${Math.random()}`
        });
      }
      return { status: res.status, message: res.message };
    }
  } else if (response.status == 401) {
    toast.error('You are not logged in. Please login for accessing this section.', {
      toastId: 'API-error-session-expired'
    });
    return { status: false, code: 401, message: 'Session Expired.' };
  } else if (response.status == 413) {
    toast.error('Media file which you attach is too large.', {
      toastId: 'API-error-file-size-too-large'
    });
    return { status: false, code: 413, message: 'file-size-too-large' };
  } else if (response.status >= 400 && response.status < 500) {
    const res = await response.json();
    if (!isToaster) {
      toast.error(res.message, {
        toastId: `API-400-error${Math.random()}`
      });
    }
    return { status: false, code: res.code, message: res.message };
  } else if (response.status >= 500) {
    const res = await response.json();
    toast.error(res, {
      toastId: `API-500-error${Math.random()}`
    });
    return {
      status: false,
      code: response.status,
      message: 'Encounter Server Side Error.'
    };
  } else {
    toast.error('Something went wrong', {
      toastId: `API-unknown-error-${Math.random()}`
    });
    return {
      status: false,
      code: response.status,
      message: 'Something went wrong.'
    };
  }
};
export const apiError = e => {
  console.log(e);
  if (e.name === 'AbortError') {
  } else {
    toast.error('Takes more than the usual time. Please refresh the page.', {
      toastId: `API-Timeout-error`
    });
  }
  return { status: false, message: e };
};

export const appendQueryParams = payload => {
  let queryParams = '?';
  if (typeof payload !== 'object') {
    return queryParams;
  }

  for (const key in payload) {
    queryParams = `${queryParams}${key}=${payload[key]}&`;
  }
  return queryParams;
};
