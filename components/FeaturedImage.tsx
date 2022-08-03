import { Image } from "lib/types";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { ViewGridIcon } from "@heroicons/react/outline";

type Props = {
  photos: Image[];
};

const processImg = (image: Image) => {
  return {
    src: image.lgUrl || image.smUrl,
    width: image.width,
    height: image.height,
    caption: image.caption ? `${image.caption}<br />Photo by ${image.by}` : `Photo by ${image.by}`,
  };
};

export default function FeaturedImage({ photos }: Props) {
  const items = photos.map((photo) => processImg(photo));
  if (items.length === 0) return null;
  const featured = photos[0];

  return (
    <Gallery options={{ dataSource: items }} withCaption>
      <Item {...processImg(featured)}>
        {({ ref, open }) => {
          const imgRef = ref as any;
          return (
            <div className="relative" onClick={open}>
              <img
                ref={imgRef}
                src={featured.lgUrl || featured.smUrl}
                width={featured.width}
                height={featured.height}
                className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover object-center rounded-lg mb-8 -mt-10 cursor-pointer"
              />
              <button
                type="button"
                className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1.5 text-sm font-medium bg-white border border-gray-300 hover:opacity-100 opacity-80 rounded-md transition-opacity"
                onClick={open}
              >
                <ViewGridIcon className="w-5 h-5 text-gray-500" />
                Show all photos
              </button>
            </div>
          );
        }}
      </Item>
    </Gallery>
  );
}
