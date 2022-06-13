import ReactSelect from "react-select";

const ReactSelectStyled = (props: any) => {
	return (
		<ReactSelect
			styles={{
				input: (base) => ({
					...base,
					"input:focus": { boxShadow: "none" },
				}),
				singleValue: (base) => ({
					...base,
					"color": "#555",
					"font-weight": "normal",
				}),
				control: (base, state) => ({
					...base,
					"border-color": state.isFocused ? "rgb(165, 180, 252)" : base["border-color"],
					"outline": "none",
					"box-shadow": state.isFocused ? "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(199, 210, 254, 0.5) 0px 0px 0px 3px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px" : base["box-shadow"],
				}),
			}}
			{...props}
		/>
	);
}

export default ReactSelectStyled
