import Link from "next/link"
import { State, County } from "lib/types";

type Props = {
	state?: State,
	county?: County,
	breadcrumbs?: boolean,
	hideState?: boolean,
	children: React.ReactNode,
}

export default function Heading({ state, county, children, breadcrumbs=true, hideState }: Props) {
	const color = state?.color || "#4a84b2";
	return (
		<header className="font-bold text-white text-2xl header-gradient my-16" style={{"--color": color} as React.CSSProperties}>
			<h1 className="p-3">{children}</h1>
			{breadcrumbs &&
				<nav className="text-[13px] leading-5 flex items-stretch">
					{county && state &&
						<>
							<Link href={`/birding-in-${state.slug}/${county.slug}-county`}>
								<a className="text-white/90 px-5 py-1.5 bg-white/10">{county.name} County</a>
							</Link>
							<Icon />
						</>
					}
					{state && !hideState &&
						<>
							<Link href={`/birding-in-${state.slug}`}>
								<a className="text-white/90 px-5 py-1.5 bg-white/10">{state.label}</a>
							</Link>
							<Icon />
						</>
					}
					<Link href="/">
						<a className="text-white/90 pl-5 pr-8 py-1.5 rounded-r-lg breadcrumb-gradient">United States</a>
					</Link>
				</nav>
			}
		</header>
	)
}

const Icon = () => (
	<div className="bg-white/10">
		<svg className="flex-shrink-0 w-[16px] h-full text-white/30" viewBox="0 0 24 44" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"></path></svg>
	</div>
);