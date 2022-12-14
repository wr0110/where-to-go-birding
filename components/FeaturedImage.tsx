import { Image } from "lib/types";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import StreetView from "components/StreetView";
import { processImg, uiElements } from "lib/photoswipe";

type Props = {
  photos: Image[];
};

export default function FeaturedImage({ photos }: Props) {
  if (photos.length === 0) return null;
  const items = photos
    .filter(({ isStreetview }, index) => !(index === 0 && isStreetview))
    .map((photo) => processImg(photo));
  const featured = photos[0];
  const isStreetview = featured.isStreetview;

  return (
    <Gallery options={{ dataSource: items }} uiElements={uiElements} withCaption>
      <Item {...processImg(featured)}>
        {({ ref, open }) => {
          const imgRef = ref as any;
          return (
            <div className="relative" onClick={open}>
              {isStreetview ? (
                <StreetView
                  className="w-full h-[250px] sm:h-[350px] md:h-[450px] rounded-lg mb-8 -mt-10"
                  {...featured.streetviewData}
                />
              ) : (
                <img
                  ref={imgRef}
                  src={featured.lgUrl || featured.smUrl}
                  width={featured.width}
                  height={featured.height}
                  className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover object-center rounded-lg mb-8 -mt-10 cursor-pointer"
                />
              )}
              {items.length > 1 && (
                <button
                  type="button"
                  className={`absolute top-4 ${
                    isStreetview ? "right-[60px]" : "right-4"
                  } flex items-center gap-2 px-3 py-0.5 text-sm font-medium bg-white  hover:opacity-100 opacity-80 rounded-sm transition-opacity`}
                  onClick={open}
                >
                  {items.length} photos
                </button>
              )}
            </div>
          );
        }}
      </Item>
    </Gallery>
  );
}
