import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      toastOptions={{
        classNames: {
          success: "text-green-600",
          error: "text-red-600",
          info: "text-blue-600",
          toast: "border border-none bg-secondary",
          title: "text-white",
          description: "text-white",
        },
      }} 
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      {...props}
    />
  );
};

export { Toaster };
