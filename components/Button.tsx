interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string,
	color?: string,
	type?: "submit" | "reset" | "button" | undefined,
	disabled?: boolean,
	children: React.ReactNode,
	[x:string]: any;
}

type ColorTypes = {
	[x:string]: string,
}

export default function Button({className, disabled, type="button", color="default", children, ...props}: ButtonProps) {
	const colors: ColorTypes = {
		default: "bg-gray-700 py-2 px-8 text-lg rounded text-white",
		orange: "bg-orange-700 py-2 px-8 text-lg rounded text-white",
		green: "bg-lime-600/90 py-2 px-8 text-lg rounded text-white font-bold",
		blue: "bg-[#233e60] py-2 px-8 text-lg rounded text-gray-200 font-bold",
	}
	const colorClasses = colors[color];
	return <button type={type} className={`${colorClasses} ${className} ${disabled ? "opacity-60" : ""}`} disabled={disabled} {...props}>{children}</button>
}