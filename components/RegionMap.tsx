type Props = {
	location: string,
}

export default function CountyMap({ location }: Props) {
	let url = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${location}&maptype=roadmap`;
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