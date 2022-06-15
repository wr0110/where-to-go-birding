type Props = {
	line1: string,
	line2?: string,
	address?: string,
}

export default function Address({ line1, line2, address }: Props) {
	return (
		<div className="mb-2">
			<h3 className="font-bold text-lg mb-1.5">{line1}</h3>
			{line2 && <h3 className="font-bold">{line2}</h3>}
			{address && <p className="whitespace-pre-line" dangerouslySetInnerHTML={{__html: address}} />}
		</div>
	)
}