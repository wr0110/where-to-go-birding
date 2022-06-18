import * as React from "react";
import Uppy from "@uppy/core";
import { DragDrop, StatusBar } from "@uppy/react";
import Transloadit from "@uppy/transloadit";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import "@uppy/core/dist/style.css";
import "@uppy/status-bar/dist/style.css";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";

const uppy = new Uppy({
  autoProceed: true,
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
				return {
					smUrl: `https://storage.googleapis.com/birding-hotspots.appspot.com/${file.transloadit.assembly}_small.jpg`,
					lgUrl: `https://storage.googleapis.com/birding-hotspots.appspot.com/${file.transloadit.assembly}_large.jpg`,
					preview: preview,
					by: null,
					isMap: false,
					isNew: true,
				}
			});
			onSuccess(images || []);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	uppy.on("thumbnail:generated", (file, preview) => {
		setPreviews({...previews, [file.id]: preview });
	});

	uppy.on("file-added", (file) => {
		console.log("FILE", file);
	});

	return (
		<>
			<DragDrop uppy={uppy} />
			<StatusBar uppy={uppy} hideUploadButton showProgressDetails />
		</>
  );
};