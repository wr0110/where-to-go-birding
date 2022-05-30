type Props = {
	text: string,
	source: string,
	link: string,
	heading: string,
}

export default function AboutSection({ text, source, link, heading }: Props) {
	return (
		<div className="mb-4">
			<h3 className="font-bold">{heading}</h3>
			<div dangerouslySetInnerHTML={{__html: text}} />
			<p className="text-[0.6rem] mt-1">
				{(source && link) &&
					<>
						From&nbsp;
						<a href={link} target="_blank" rel="noopener noreferrer">{source}</a>
					</>
				}
				{(source && ! link) && <span className="text-xs">From {source}</span>}
			</p>
		</div>
	)
}