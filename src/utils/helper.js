import { toast } from 'react-toastify';

export const verifyEmail = (email, message = true) => {
  if (email.trim() == '' && !email) {
    toast.error(`Email should not be empty`, {
      toastId: 'empty-email-verification-error'
    });
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    toast.error(`"${email}" is an invalid email address`, {
      toastId: 'email-verification-error'
    });
  }
  return isValidEmail;
};

export const comparePasswords = (a, b, message = true) => {
  if (a != b) {
    if (message) {
      toast.error(`Password mismatch`, {
        toastId: 'password-verification-error'
      });
    }
    return false;
  }
  return true;
};

export const isRequired = (val, field = '', message = true) => {
  if (val && val.trim() != '') {
    return true;
  }
  if (message) {
    toast.error(`"${field}" should not be empty`, {
      toastId: 'empty-field-verification-error'
    });
  }
  return false;
};

export const customUTCDate = date => {
  // Convert custom date to UTC
  console.log(typeof date);
  const universalDateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return universalDateUTC.toISOString();
};

export const notZero = (val, field = 'Value', message = true) => {
  let num = parseFloat(val);
  if (num == 0) {
    if (message) {
      toast.error(`"${field}" should not be zero`, {
        toastId: 'zero-field-verification-error'
      });
    }
    return false;
  }
  return true;
};
export const mapValue = (value, inMin, inMax, outMin, outMax, label, color) => {
  return {
    bmi: ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin,
    label: label,
    color: color
  };
};

export const isObjectEmpty = obj => {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0;
};


export const imageValidator = (file, size) => {
  if (!file) return false;

  function formatSize(bytes) {
    const kb = bytes / 1024;
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(0)} KB`;
  }

  if (file && file.size <= size) {
    if (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/webp' || file.type == 'image/gif' || file.type == 'image/svg+xml' || file.type == 'image/svg') {
      return true;
    } else {
      toast.error('File not supported', {
        toastId: 'upload-error-1'
      });
      return false;
    }
  } else {
    toast.error(`File size too large and exceeds ${formatSize(size)}.`, {
      toastId: 'upload-error-1'
    });
    return false;
  }
};

export const createObjectURL = file => {
  return URL.createObjectURL(file);
};

export const mediaFileType = file => {
  if (file.type == 'video/mp4' || file.type == 'video/quicktime') {
    return 'video';
  } else if (file.type == 'audio/wav' || file.type == 'audio/mp3') {
    return 'audio';
  } else {
    return 'image';
  }
};

export const validateForm = (formValues, { exceptions = [], customMessages = {} } = {}) => {
  const errors = {};

  const setFieldError = (field, message) => {
    errors[field] = message;
  };

  const isOptionalField = field => exceptions.includes(field);

  Object.keys(formValues).forEach(key => {
    if (!formValues[key] && !isOptionalField(key)) {
      setFieldError(key, customMessages[key] || 'Required');
    }
  });

  if (formValues.email && !verifyEmail(formValues.email, true)) {
    setFieldError('email', customMessages.email || 'Invalid email address');
  }

  if (formValues.email && formValues.confEmail && formValues.email !== formValues.confEmail) {
    setFieldError('email', customMessages.confEmail || 'Emails do not match');
    setFieldError('confEmail', customMessages.confEmail || 'Emails do not match');
  }

  if (formValues.password && formValues.confPassword && !comparePasswords(formValues.password, formValues.confPassword, true)) {
    setFieldError('password', customMessages.password || 'Passwords do not match');
    setFieldError('confPassword', customMessages.confPassword || 'Passwords do not match');
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const disableFormElements = (elements, shouldDisable = true) => {
  for (let element of elements) {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
      element.disabled = shouldDisable;
    }
  }
};

export const getDiscountedPrice = (price, discount) => {
  let discountAmt = (price * discount) / 100;
  let discountedPrice = price - discountAmt;
  return discountedPrice;
};

export const isValidUrl = (url, returnError = false) => {
  if (!url || url.trim() === '') {
    return returnError ? { valid: false, error: 'URL cannot be empty' } : false;
  }

  if (!/^https?:\/\//i.test(url)) {
    return returnError ? { valid: false, error: 'URL must start with http:// or https://' } : false;
  }

  const validUrlRegex = /^https?:\/\/(?:www\.)?(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/\S*)?$/;

  if (!validUrlRegex.test(url)) {
    return returnError ? { valid: false, error: 'Please enter a complete URL with a valid domain name and extension' } : false;
  }

  const domainPart = url.replace(/^https?:\/\//i, '').split('/')[0];
  const domainParts = domainPart.split('.');

  if (domainParts.length < 2) {
    return returnError ? { valid: false, error: 'Please enter a complete URL with a valid domain extension' } : false;
  }

  const tld = domainParts[domainParts.length - 1];

  const allowedTlds = ['com', 'net', 'org', 'edu', 'gov', 'mil', 'io', 'co', 'info', 'biz', 'dev', 'me', 'app', 'tech', 'online', 'site', 'store', 'blog', 'xyz', 'ai', 'uk', 'us', 'ca', 'eu', 'in'];

  if (!allowedTlds.includes(tld.toLowerCase())) {
    return returnError ? { valid: false, error: 'Please enter a complete URL with a valid domain extension' } : false;
  }

  return returnError ? { valid: true, error: null } : true;
};

export function formatNumber(num) {
  // Validate input
  if (typeof num !== 'number' || isNaN(num)) {
    throw new Error('Input must be a valid number');
  }

  if (num < 1000) return num.toString(); // Return as-is if less than 1000

  if (num >= 1000 && num < 1000000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k';
  }

  if (num >= 1000000) {
    return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'm';
  }

  return num.toString();
}

export async function urlToFile(url, filename) {
  console.log(url);
  try {
    const respose = await fetch(url, { mode: 'no-cors' });
    const blob = await respose.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.log(error);
  }
}

export function formatDate(date) {
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export const convertToLocalTime = isoString => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone
  }).format(date);
};

export function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export const getHueRotate = tokenId => {
  const id = Number(tokenId);
  const multiplier = id % 2 === 0 ? 30 : 7;
  const angle = (id * multiplier) % 360;
  return `hue-rotate(${angle}deg)`;
};
