import Link from "next/link";
import { State, County } from "lib/types";

type Props = {
  state?: State;
  county?: County;
  breadcrumbs?: boolean;
  hideState?: boolean;
  children: React.ReactNode;
  color?: "red" | "blue" | "green" | "yellow" | "orange" | "purple" | "turquoise";
  className?: string;
  [x: string]: any;
};

export default function PageHeading({
  state,
  county,
  children,
  breadcrumbs = true,
  hideState,
  className,
  ...props
}: Props) {
  const bgColor = state?.color || "#4a84b2";
  return (
    <header
      className={`font-bold text-white text-2xl header-gradient my-16 ${className || ""}`}
      style={{ "--color": bgColor } as React.CSSProperties}
      {...props}
    >
      <h1 className="p-3">{children}</h1>
      {breadcrumbs && (
        <nav className="text-xs sm:text-[13px] leading-4 sm:leading-5 flex items-stretch">
          {county && state && (
            <>
              <Link href={`/${state.slug}/${county.slug}-county`}>
                <a className="text-white/90 px-5 py-1.5 bg-white/10 flex items-center">{county.name} County</a>
              </Link>
              <Icon />
            </>
          )}
          {state && !hideState && (
            <>
              <Link href={`/${state.slug}`}>
                <a className="text-white/90 px-5 py-1.5 bg-white/10 flex items-center">{state.label}</a>
              </Link>
              <Icon />
            </>
          )}
          <Link href="/">
            <a className="text-white/90 pl-5 pr-8 py-1.5 rounded-r-lg breadcrumb-gradient flex items-center">
              United States
            </a>
          </Link>
        </nav>
      )}
    </header>
  );
}

const Icon = () => (
  <div className="bg-white/10">
    <svg
      className="flex-shrink-0 w-[16px] h-full text-white/30"
      viewBox="0 0 24 44"
      preserveAspectRatio="none"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"></path>
    </svg>
  </div>
);
