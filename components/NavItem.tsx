import Link from "next/link";

type Props = {
	label: string,
	href?: string,
	target?: string,
	className?: string,
}

export default function NavItem({ label, href, target, className }: Props) {
	const LinkClasses = "text-xs font-bold text-gray-700 hover:text-gray-600 cursor-pointer uppercase";

	return (
		<li key={label} className={`relative group transition-all ${className || ""}`}>
			{target === "_blank" ? (
				<a href={href} className={LinkClasses} target="_blank" rel="noreferrer">
					{label}
				</a>
			) : (
				href
					? <Link href={href}><a className={LinkClasses}>{label}</a></Link>
					: <span className={LinkClasses}>{label}</span>
			)}
		</li>
	)
}