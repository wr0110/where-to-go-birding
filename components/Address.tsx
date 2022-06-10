type Props = {
	line1: string,
	line2?: string,
	street?: string,
	city?: string,
	state?: string,
	zip?: string,
}

export default function Address({ line1, line2, street, city, state, zip }: Props) {
	return (
		<div>
			<h3 className="font-bold">{line1}</h3>
			{line2 && <h3 className="font-bold">{line2}</h3>}
			{street &&
				<>
					<span>{street}</span><br/>
				</>
			}
			{city && <span>{city}, {state} {zip}</span>}
		</div>
	)
}