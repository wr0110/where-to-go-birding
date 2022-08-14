import * as React from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getUploads, getHotspotByLocationId } from "lib/mongo";
import { getStateByCode, getCountyByCode } from "lib/localData";
import Title from "components/Title";
import Heading from "components/Heading";
import AdminPage from "components/AdminPage";
import { Upload } from "lib/types";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import useSecureFetch from "hooks/useSecureFetch";

type Item = {
  name: string;
  locationId: string;
  countryCode?: string;
  stateLabel?: string;
  countyLabel?: string;
  uploads: Upload[];
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const uploads = await getUploads();
  const items: Item[] = [];

  uploads.forEach(async (upload: Upload) => {
    if (!items.find((item) => item.locationId === upload.locationId)) {
      items.push({
        name: "",
        locationId: upload.locationId,
        uploads: [upload],
      });
    } else {
      const index = items.findIndex((item) => item.locationId === upload.locationId);
      items[index].uploads.push(upload);
    }
  });

  const formattedItems = await Promise.all(
    items.map(async (item) => {
      const hotspot = await getHotspotByLocationId(item.locationId);
      const state = getStateByCode(hotspot?.stateCode);
      const county = getCountyByCode(hotspot.countyCode);
      return {
        ...item,
        stateLabel: state?.label || "",
        countyLabel: county?.name || "",
        countryCode: hotspot.countryCode,
        name: hotspot.name,
      };
    })
  );

  return {
    props: { items: formattedItems },
  };
};

type Props = {
  items: Item[];
};

export default function County({ items: allItems }: Props) {
  const [items, setItems] = React.useState(allItems);
  const secureFetch = useSecureFetch();

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this photo?")) return;
    setItems((prev) => prev.map((item) => ({ ...item, uploads: item.uploads.filter((upload) => upload._id !== id) })));
    await secureFetch(`/api/upload/reject?id=${id}`, "GET");
  };

  const handleApprove = async (id: string) => {
    setItems((prev) => prev.map((item) => ({ ...item, uploads: item.uploads.filter((upload) => upload._id !== id) })));
    await secureFetch(`/api/upload/approve?id=${id}`, "GET");
  };

  return (
    <AdminPage title="Image Review">
      <div className="container pb-16">
        <Title>Image Review</Title>
        <Heading className="my-10">Image Review</Heading>
        {items.map((item) => (
          <section className="p-4 bg-gray-100 mt-4" key={item.locationId}>
            <h3 className="text-lg font-bold">{item.name}</h3>
            {item.countyLabel ? (
              <p>
                {item.countyLabel}, {item.stateLabel}, {item.countryCode}
              </p>
            ) : (
              <p>
                {item.stateLabel}, {item.countryCode}
              </p>
            )}
            <div
              className={`grid ${
                item.uploads.length > 0 ? "xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : ""
              } gap-4 mt-4`}
            >
              <Gallery withCaption>
                {item.uploads.map(({ width, height, _id, smUrl, lgUrl, caption, by, email }) => {
                  const isVertical = width && height && height > width;
                  return (
                    <article className="flex flex-col space-y-2" key={_id}>
                      <Item caption={caption} original={lgUrl || smUrl} width={width} height={height}>
                        {({ ref, open }) => {
                          const imgRef = ref as any;
                          return (
                            <img
                              ref={imgRef}
                              onClick={open}
                              src={smUrl}
                              className={`cursor-pointer w-full h-[180px] bg-zinc-700 ${
                                isVertical ? "object-contain" : "object-cover"
                              } rounded`}
                            />
                          );
                        }}
                      </Item>
                      <p className="text-[11px] leading-5">
                        By <strong>{by}</strong> ({email})
                      </p>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => handleApprove(_id as string)}
                          className="text-green-700 text-sm opacity-70 hover:opacity-100 bg-white shadow font-bold py-1 px-4 w-full transition-opacity"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(_id as string)}
                          className="text-red-700 text-sm opacity-70 hover:opacity-100 bg-white shadow font-bold py-1 px-4 w-full transition-opacity"
                        >
                          Reject
                        </button>
                      </div>
                    </article>
                  );
                })}
              </Gallery>
              {item.uploads.length === 0 && (
                <p>
                  Consider sorting the images for this hotspot based on quality/relevance.{" "}
                  <Link href={`/hotspot/${item.locationId}`}>
                    <a className="font-bold" target="_blank">
                      View Hotspot
                    </a>
                  </Link>
                </p>
              )}
            </div>
          </section>
        ))}
        {items.length === 0 ? <p className="text-lg text-gray-500">No photos to review</p> : null}
      </div>
    </AdminPage>
  );
}
