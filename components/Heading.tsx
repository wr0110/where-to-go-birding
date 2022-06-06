type Props = {
	color?: string,
	children: React.ReactNode,
}

export default function Heading({color="#4a84b2", children}: Props) {
	return <h1 className="font-bold text-white text-2xl header-gradient p-3 my-16" style={{"--county-color": color} as React.CSSProperties}>{children}</h1>
}