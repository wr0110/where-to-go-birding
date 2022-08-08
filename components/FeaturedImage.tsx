import { Image } from "lib/types";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { ViewGridIcon } from "@heroicons/react/outline";

type Props = {
  photos: Image[];
};

const processImg = (image: Image) => {
  let caption = "";
  if (image.caption) {
    caption = image.caption;
  }
  if (image.by) {
    caption = image.caption ? `${image.caption}<br />Photo by ${image.by}` : `Photo by ${image.by}`;
  }
  return {
    src: image.lgUrl || image.smUrl,
    width: image.width,
    height: image.height,
    caption,
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
              {photos.length > 1 && (
                <button
                  type="button"
                  className="absolute top-4 right-4 flex items-center gap-2 px-3 py-0.5 text-sm font-medium bg-white  hover:opacity-100 opacity-80 rounded-md transition-opacity"
                  onClick={open}
                >
                  {photos.length} photos
                </button>
              )}
            </div>
          );
        }}
      </Item>
    </Gallery>
  );
}
