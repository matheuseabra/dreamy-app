import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      
      {...props}
    />
  );
};

// Custom toast functions with colorful icons
const customToast = {
  success: (message: string, options?) => {
    return toast.success(message, {
      icon: <CheckCircle className="h-5 w-5" />,
      className: "success",
    });
  },
  error: (message: string, options?) => {
    return toast.error(message, {
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      ...options,
    });
  },
  warning: (message: string, options?) => {
    return toast.warning(message, {
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      ...options,
    });
  },
  info: (message: string, options?) => {
    return toast.info(message, {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      ...options,
    });
  },
};

export { customToast as toast, Toaster };

