import { toast, type ToastOptions } from "vue3-toastify";

type ToastType = "success" | "error" | "info" | "warn";

const baseOptions: ToastOptions = {
  autoClose: 2500,
  position: "top-right",
  pauseOnHover: true,
  hideProgressBar: false,
};

function show(type: ToastType, message: string, options?: ToastOptions) {
  const opts = { ...baseOptions, ...(options || {}) };
  switch (type) {
    case "success":
      return toast.success(message, opts);
    case "error":
      return toast.error(message, opts);
    case "info":
      return toast.info(message, opts);
    case "warn":
      return toast.warn(message, opts);
  }
}

export const toastMixin = {
  methods: {
    toastSuccess(message: string, options?: ToastOptions) {
      return show("success", message, options);
    },
    toastError(message: string, options?: ToastOptions) {
      return show("error", message, options);
    },
    toastInfo(message: string, options?: ToastOptions) {
      return show("info", message, options);
    },
    toastWarn(message: string, options?: ToastOptions) {
      return show("warn", message, options);
    },
  },
};

export type ToastMixin = typeof toastMixin;
