import * as React from "react";
import Nav from "data/nav.json";
import NavItem from "components/NavItem";
import Link from "next/link";
import Search from "components/Search";
import { SearchIcon } from "@heroicons/react/outline";
import Logo from "components/Logo";

export default function Header() {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [showSearch, setShowSearch] = React.useState<boolean>(false);

  React.useEffect(() => {
    const onScroll = () => {
      setCollapsed(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="bg-white border-b static md:fixed top-0 right-0 left-0 pl-3 sm:pr-4 md:pr-10 shadow-sm z-[10000]">
        <div>
          <div className="sm:flex justify-between py-2 items-center">
            <div className="flex pr-8 justify-between">
              <Link href="/">
                <a className="flex gap-2 items-center">
                  <Logo className={`w-[50px] ${!collapsed ? "md:w-[85px]" : ""} transition-all duration-300 h-auto`} />
                  <div className="flex flex-col justify-center">
                    <h1
                      className={`text-lg ${!collapsed ? "md:text-3xl" : ""} text-gray-900 transition-all duration-300`}
                    >
                      Birding Hotspots
                    </h1>
                    <em className="text-[0.8em] leading-4 text-[#92ad39] font-medium">Where to Go Birding</em>
                  </div>
                </a>
              </Link>
              <button type="button" onClick={() => setShowSearch(true)} className="sm:hidden">
                <SearchIcon className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-2 md:mt-0">
              <ul className="flex gap-7">
                <li className="items-center justify-center hidden sm:flex">
                  <button type="button" onClick={() => setShowSearch(true)}>
                    <SearchIcon className="h-5 w-5" />
                  </button>
                </li>
                {Nav.map((item) => (
                  <NavItem key={item.label} {...item} />
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
      {showSearch && <Search onClose={() => setShowSearch(false)} />}
    </>
  );
}
