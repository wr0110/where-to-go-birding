import Link from "next/link";
import Caret from "icons/DownCaret";

type Props = {
	label: string,
	href?: string,
	target?: string,
	childItems?: Props[],
	className?: string,
	collapsed?: boolean,
}

export default function NavItem({ label, href, target, childItems, className, collapsed }: Props) {
	const LinkClasses = `
		transition-all
		block
		text-xs
		font-bold
		text-gray-600
		hover:text-gray-500
		cursor-pointer ${className || ""}
	`;
	const UlClasses = `
		bg-white
		px-8
		py-0
		lg:py-4
		border-t-[3px]
		divide-y
		divide-gray-100
		lg:divide-none
		w-full
		lg:w-[230px]
		flex
		flex-col
		shadow-none
		lg:shadow-md
		border-t-0
		lg:border-t-[#2ea3f2]
		visible
		lg:invisible
		group-hover:visible
		static
		lg:absolute
		left-0
		opacity-100
		lg:opacity-0
		group-hover:opacity-100
		scale-y-100
		lg:scale-y-50
		group-hover:scale-y-100
		transition-all
		origin-top
		duration-300
		${collapsed ? "top-[41px]" : "top-[81px]"}
	`;

	return (
		<li key={label} className={`relative group`}>
			{target === "_blank" ? (
				<a href={href} className={LinkClasses} target="_blank" rel="noreferrer">
					{label}
				</a>
			) : (
				href
					? <Link href={href}><a className={LinkClasses}>{label}</a></Link>
					: <span className={LinkClasses}>{label} <Caret className="invisible lg:visible" /></span>
			)}
			{childItems &&
				<ul className={UlClasses}>
					{childItems.map(child => (
						<NavItem key={child.label} className="py-4" {...child} />
					))}
				</ul>
			}
		</li>
	)
}