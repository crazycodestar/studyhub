import { ButtonHTMLAttributes, ComponentProps, FC } from "react";

type variant = "primary" | "secondary";

interface IButtonProps extends ComponentProps<"button"> {
  variant?: variant;
}

const Button: FC<IButtonProps> = ({
  onClick,
  children,
  variant = "primary",
  ...others
}) => {
  const generateStyling = () => {
    const base = "capitalize cursor-pointer rounded-md px-4 py-2";

    switch (variant) {
      case "primary":
        return base + " " + "bg-pink-600 text-white hover:bg-pink-500";

      case "secondary":
        return base + " " + "hover:bg-slate-500";
    }
  };
  return (
    <button className={generateStyling()} onClick={onClick} {...others}>
      {children}
    </button>
  );
};

export default Button;
