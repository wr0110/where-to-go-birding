import * as React from "react";
import { MailIcon } from "@heroicons/react/outline";
import Nav from "data/oh-nav.json";
import NavItem from "components/NavItem";
import HamburgerIcon from "icons/Hamburger";

type Props = {
	stateLabel: string,
	email: string,
}

export default function Header({ email }: Props) {
	const [collapsed, setCollapsed] = React.useState<boolean>(false);
	const [mobileShow, setMobileShow] = React.useState<boolean>(false);
	
	React.useEffect(() => {
		const onScroll = () => {
			setCollapsed(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50);
		}
		window.addEventListener("scroll", onScroll)
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header className="bg-white border-b static lg:fixed top-0 right-0 left-0">
			<div className="bg-[#4a84b2] py-2">
				<div className="container flex gap-6 justify-end text-xs">
					<a href={`mailto:${email}`} className="text-white flex gap-1 items-center" target="_blank" rel="noreferrer">
						<MailIcon className="h-4 w-4 opacity-85" /> {email}
					</a>
				</div>
			</div>
			<div>
				<div className="container flex justify-between">
					<span>Logo</span>
					<nav>
						<ul className="flex-col lg:flex-row absolute lg:relative shadow-lg lg:shadow-none p-6 lg:p-0 bg-white left-[8%] right-[8%] lg:top-0 top-[116px] flex gap-6 border-t-[#2ea3f2] border-t-[3px] lg:border-t-0">
							{Nav.map((item) => (
								<NavItem key={item.label} collapsed={collapsed} className={`bg-gray-100 lg:bg-transparent p-4 ${collapsed ? "lg:py-3" : "lg:py-8"}`} {...item} />
							))}
						</ul>
					</nav>
					<HamburgerIcon className="block lg:hidden cursor-pointer text-xl text-[#2EA3F2] my-8" onClick={() => setMobileShow(!collapsed)} />
				</div>
			</div>
			
		</header>
	)
}