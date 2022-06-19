import * as React from "react";
import { Image } from "lib/types";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

type Props = {
	images: Image[],
}

export default function MapList({ images }: Props) {
	const ref = React.useRef<any>();
	const filtered = images.filter(item => item.smUrl && item.isMap);

	const items = filtered.map(image => ({
		original: image.lgUrl || image.smUrl,
		thumbnail: image.smUrl,
		width: image.width,
		height: image.height,
	}));

	if (items.length === 0) return null;

	return (
		<div className="flex flex-col gap-6 mt-6">
			<Gallery>
				{items.map(item => (
					<Item key={item.original} {...item}>
						{({ ref, open }) => {
							const imgRef = ref as any;
							return <img ref={imgRef} onClick={open} src={item.thumbnail} className="w-full cursor-pointer" width={item.width} height={item.height} />
						}}
					</Item>
				))}
			</Gallery>
		</div>
	);
}