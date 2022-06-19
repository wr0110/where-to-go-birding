import * as React from "react";
import Uppy from "@uppy/core";
import { DragDrop, StatusBar } from "@uppy/react";
import Transloadit from "@uppy/transloadit";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import { v4 as uuidv4 } from "uuid";
import "@uppy/core/dist/style.css";
import "@uppy/status-bar/dist/style.css";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";

const uppy = new Uppy({
  autoProceed: true,
	onBeforeFileAdded: (file) => {
		const name = `${uuidv4()}.${file.extension}`;
		return {
			...file,
			name,
			meta: { ...file.meta, name }
		}
	}
});

uppy.use(Transloadit, {
	params: {
		auth: { key: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY || "" },
		template_id: process.env.NEXT_PUBLIC_TRANSLOADIT_TEMPLATE_ID || "",
	}
});

uppy.use(ThumbnailGenerator, {
  id: "ThumbnailGenerator",
  thumbnailWidth: 300,
  thumbnailHeight: 300,
  thumbnailType: "image/jpeg",
  waitForThumbnailsBeforeUpload: false,
});

type Props = {
	onSuccess: (response: any) => void,
}

export default function ImageInput({ onSuccess }: Props) {
	const [previews, setPreviews] = React.useState<any>({});
	const previewsRef = React.useRef<any>(null);
	previewsRef.current = previews;

	React.useEffect(() => {
		uppy.on("complete", (result) => {
			const images = result.successful.map((file: any) => {
				const preview = previewsRef.current ? previewsRef.current[file.id] : null;
				const baseName = file.name.split(".")[0];
				return {
					smUrl: `https://storage.googleapis.com/birding-hotspots.appspot.com/${baseName}_small.jpg`,
					lgUrl: `https://storage.googleapis.com/birding-hotspots.appspot.com/${baseName}_large.jpg`,
					preview: preview,
					by: null,
					width: file.meta.width || null,
					height: file.meta.height || null,
					isMap: false,
					isNew: true, //Because isNew isn't in the Mongoose schema it gets filtered out on save
				}
			});
			onSuccess(images || []);
		});

		uppy.on("thumbnail:generated", (file, preview) => {
			setPreviews((current: any) => ({...current, [file.id]: preview }));
		});
	
		uppy.on("file-added", (file) => {
			const data = file.data;
			const url = URL.createObjectURL(data);
			const image = new Image();
			image.src = url;
			image.onload = () => {
				uppy.setFileMeta(file.id, { width: image.width, height: image.height })
				URL.revokeObjectURL(url);
			}
		});

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<DragDrop uppy={uppy} />
			<StatusBar uppy={uppy} hideUploadButton showProgressDetails />
		</>
  );
};