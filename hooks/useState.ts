import States from "data/states.json";

export default function useState(param: string) {
	const slug = param.replace("birding-in-", "");
	const data = States.find(state => state.slug === slug);
	return data;
}