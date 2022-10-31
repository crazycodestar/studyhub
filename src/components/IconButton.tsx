import { ComponentProps, FC } from "react";

type variant = "primary" | "secondary" | "support" | "share";

interface IIconButtonProps extends ComponentProps<"button"> {
  variant?: variant;
}
const IconButton: FC<IIconButtonProps> = ({
  onClick,
  children,
  variant = "primary",
}) => {
  const generateStyles = () => {
    const base = "rounded-full p-2 text-slate-700";
    switch (variant) {
      case "primary":
        return base.concat(" ", "hover:text-slate-500 hover:bg-slate-200");
      case "secondary":
        return base.concat(" ", "hover:text-pink-500 hover:bg-pink-200");
      case "support":
        return base.concat(" ", "hover:text-green-500 hover:bg-green-200");
      case "share":
        return base.concat(" ", "hover:text-blue-500 hover:bg-blue-200");
    }
  };
  return (
    <button onClick={onClick} className={generateStyles()}>
      {children}
    </button>
  );
};

export default IconButton;
