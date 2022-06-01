import "../styles/globals.css";
import Footer from "components/Footer";
import Header from "components/Header";

function MyApp({ Component, pageProps }) {
	const state = {
		code: "OH",
		label: "Ohio",
		facebook: "ohiobirds.org",
		twitter: "oosbirds",
		email: "hotspots@ohiobirds.org",
	}
	
	return (
		<>
			<Header />
			<Component {...pageProps} />
			<Footer/>
		</>
	)
}

export default MyApp
