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
			<Header email={state.email} stateLabel={state.label} />
			<Component {...pageProps} />
			<Footer stateLabel={state.label} facebook={state.facebook} twitter={state.twitter} />
		</>
	)
}

export default MyApp
