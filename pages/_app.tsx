import type { AppProps } from "next/app";
import "../styles/globals.css";
import Footer from "components/Footer";
import Header from "components/Header";
import { UserProvider } from "providers/user";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<Header />
			<Component {...pageProps} />
			<Footer/>
		</UserProvider>
	)
}

export default MyApp
