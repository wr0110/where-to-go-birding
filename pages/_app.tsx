import "../styles/globals.css";
import Footer from "components/Footer";

function MyApp({ Component, pageProps }) {
	const state = {
		code: "OH",
		label: "Ohio",
		facebook: "ohiobirds.org",
		twitter: "oosbirds",
	}
	
	return (
		<>
		<Component {...pageProps} />
			<Footer stateLabel={state.label} facebook={state.facebook} twitter={state.twitter} />
	</>
	)
}

export default MyApp
