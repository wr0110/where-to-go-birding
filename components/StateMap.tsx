type Props = {
	location: string,
	zoom: number,
}

export default function StateMap({ location, zoom }: Props) {
	let url = `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&center=${location}&maptype=roadmap&zoom=${zoom}`;
	return (
		<iframe
			key={url}
			width="600"
			height="450"
			style={{ border: 0 }}
			loading="lazy"
			allowFullScreen
			referrerPolicy="no-referrer-when-downgrade"
			src={url}
			className="w-full"
		/>
	)
}