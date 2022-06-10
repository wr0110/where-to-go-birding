import Head from "next/head";

type TitleProps = {
	children?: string,
}

export default function Title({children}: TitleProps) {
	return (
		<Head>
			<title>{children ? `${children} - eBird Hotspots` : "eBird Hotspots"}</title>
		</Head>
	)
}