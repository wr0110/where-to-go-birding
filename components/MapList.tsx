import { Image } from "lib/types";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { uiElements } from "lib/photoswipe";

type Props = {
  images: Image[];
};

export default function MapList({ images }: Props) {
  const items = images.map((image) => ({
    original: image.lgUrl || image.smUrl,
    thumbnail: image.lgUrl && image.height && image.width && image.height > image.width ? image.lgUrl : image.smUrl,
    width: image.width,
    height: image.height,
    by: image.by,
    caption: image.caption,
    downloadUrl: image.originalUrl || image.lgUrl || image.smUrl,
  }));

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 mt-6">
      <Gallery uiElements={uiElements} withCaption>
        {items.map((item) => (
          <div key={item.original}>
            <Item key={item.original} {...item}>
              {({ ref, open }) => {
                const imgRef = ref as any;
                return (
                  <img
                    ref={imgRef}
                    onClick={open}
                    src={item.thumbnail}
                    className="w-full cursor-pointer"
                    width={item.width}
                    height={item.height}
                  />
                );
              }}
            </Item>
            {item.caption && <span className="text-xs" dangerouslySetInnerHTML={{ __html: item.caption }} />}
            {item.by && <span className="text-xs" dangerouslySetInnerHTML={{ __html: item.by }} />}
          </div>
        ))}
      </Gallery>
    </div>
  );
}
