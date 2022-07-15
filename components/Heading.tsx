type Props = {
  children: React.ReactNode;
  color?: "red" | "blue" | "green" | "yellow" | "orange" | "purple" | "turquoise";
  colorCode?: string;
  className?: string;
  [x: string]: any;
};

const colors = {
  red: "#ce0d02",
  blue: "#4a84b2",
  green: "#92ad39",
  yellow: "#efd75e",
  orange: "#e57700",
  purple: "#8c4cb5",
  turquoise: "#46a695",
};

export default function Heading({ children, color, colorCode, className, ...props }: Props) {
  const bgColor = colorCode || (color && colors[color]) || "#4a84b2";
  return (
    <h2
      className={`font-bold text-white text-2xl header-gradient p-3 rounded-md ${className || ""}`}
      style={{ "--color": bgColor } as React.CSSProperties}
      {...props}
    >
      {children}
    </h2>
  );
}
