import type { AppProps } from "next/app";
import "../styles/globals.css";
import Footer from "components/Footer";
import Header from "components/Header";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Header />
			<Component {...pageProps} />
			<Footer/>
		</>
	)
}

export default MyApp
