let toastInstance = null;

export const setupGlobalToast = (toast) => {
  toastInstance = toast;
};

export const getToast = () => {
  return toastInstance;
};
