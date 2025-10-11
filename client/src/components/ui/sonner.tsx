import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      toastOptions={{
        style: {
          background: "#1c1921",
        },
        classNames: {
          title: "text-white",
          description: "text-white",
        },
      }} 
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      {...props}
    />
  );
};

export { Toaster };
