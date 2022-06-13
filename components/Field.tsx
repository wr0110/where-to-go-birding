type InputProps = {
	label: string,
	children: React.ReactNode,
}

const Field = ({ label, children }: InputProps) => {
	return (
		<div>
			<label className="text-gray-500 font-bold">
				{label} <br/>
				{children}
			</label>
		</div>
	)
}

export default Field
