interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  color?: string;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  children: React.ReactNode;
  [x: string]: any;
}

type ColorTypes = {
  [x: string]: string;
};

export default function BtnSmall({
  className,
  disabled,
  type = "button",
  color = "default",
  children,
  ...props
}: ButtonProps) {
  const colors: ColorTypes = {
    default: "bg-gray-700 py-1 px-2 text-sm rounded text-white",
    gray: "bg-gray-300 py-1 px-2 text-sm rounded text-gray-700",
    orange: "bg-orange-700 py-1 px-2 text-sm rounded text-white",
    green: "bg-lime-600/90 py-1 px-2 text-sm rounded text-white",
    blue: "bg-[#233e60] py-1 px-2 text-sm rounded text-gray-200",
    lightblue: "bg-[#4a84b2] py-1 px-2 text-sm rounded text-white",
  };
  const colorClasses = colors[color];
  return (
    <button
      type={type}
      className={`${colorClasses} ${className} ${disabled ? "opacity-60" : ""}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
