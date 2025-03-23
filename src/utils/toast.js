import { toast } from 'react-toastify';

const options = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showDefaultMessage = message => {
  toast(message, { ...options, toastId: `default-Toaster-${Math.random()}` });
};

export const showSuccessMessage = message => {
  toast.success(message, { ...options, toastId: `Success-Toaster-${Math.random()}` });
};

export const showErrorMessage = message => {
  toast.error(message, { ...options, toastId: `error-Toaster-${Math.random()}` });
};

export const showInfoMessage = message => {
  toast.info(message, { ...options, toastId: `info-Toaster-${Math.random()}` });
};

export const showDescriptionMessage = (title, description) => {
  toast(
    <div>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>,
    { ...options, toastId: `description-Toaster-${Math.random()}` }
  );
};