import * as React from "react";
import { Image } from "lib/types";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { XIcon } from "@heroicons/react/outline";

type Props = {
  images: Image[];
};

export default function Slideshow({ images }: Props) {
  const ref = React.useRef<any>();
  const filtered = images.filter((item) => item.smUrl && !item.isMap);
  const photographers = filtered.map((item) => item.by).filter((item) => item);
  const uniquePhotographers = [...new Set(photographers)];

  const slides = filtered.map((image) => ({
    fullscreen: image.lgUrl || image.smUrl,
    original: image.smUrl,
    thumbnail: image.smUrl,
    originalHeight: image.height,
    originalWidth: image.width,

    description: [
      <div key={image.smUrl} className="text-xs" dangerouslySetInnerHTML={{ __html: image.caption || "" }} />,
    ],
  }));

  const handleClick = () => {
    if (!ref.current) return;
    ref.current.fullScreen();
  };

  if (slides.length === 0) return null;

  return (
    <>
      <ImageGallery
        ref={ref}
        //@ts-ignore
        items={slides}
        useBrowserFullscreen={false}
        showThumbnails={filtered.length > 1}
        showPlayButton={false}
        onClick={handleClick}
        slideDuration={1000}
        slideInterval={50000}
        lazyLoad
        autoPlay
        renderFullscreenButton={(onClick, isFullscreen) =>
          isFullscreen && (
            <XIcon
              onClick={(e: any) => onClick(e)}
              className="h-8 w-8 absolute top-2 right-4 cursor-pointer opacity-70 transition-opacity text-white hover:opacity-100 drop-shadow-sm"
            />
          )
        }
      />
      {!!uniquePhotographers.length && <p className="mt-2 text-xs">Photos by {uniquePhotographers.join(", ")}</p>}
    </>
  );
}
