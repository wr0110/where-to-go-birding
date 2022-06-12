type Props = {
	text: string,
	heading: string,
}

export default function AboutSection({ text, heading }: Props) {
	return (
		<div className="mb-4">
			<h3 className="font-bold">{heading}</h3>
			<div dangerouslySetInnerHTML={{__html: text}} />
		</div>
	)
}