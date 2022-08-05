import { useFormContext } from "react-hook-form";
import { TrashIcon } from "@heroicons/react/outline";
import { Image } from "lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props extends Image {
  handleDelete: (i: number, url: string, isNew: boolean) => void;
  i: number;
  hideExtraFields?: boolean;
}

export default function SortableImage({
  handleDelete,
  id,
  i,
  width,
  height,
  preview,
  smUrl,
  isNew,
  hideExtraFields,
}: Props) {
  const { register } = useFormContext();
  const isVertical = width && height && height > width;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id || "",
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <article
      ref={setNodeRef}
      style={style}
      key={id}
      className={`flex flex-col gap-2 rounded bg-gray-50 relative group ${isDragging ? "z-10" : ""}`}
    >
      <img
        src={preview || smUrl}
        className={`w-full h-[240px] bg-zinc-700 ${isVertical ? "object-contain" : "object-cover"} rounded cursor-move`}
        {...attributes}
        {...listeners}
        tabIndex={-1}
      />
      <div className="px-3 pb-2 text-xs w-full">
        <label className="text-gray-500 font-bold mb-2 relative flex">
          <span className="absolute top-[5px] left-[1px] bottom-[1px] px-[7px] bg-gray-200 flex items-center rounded-l-[5px]">
            Caption
          </span>
          <input
            type="text"
            {...register(`images.${i}.caption` as const)}
            className="form-input py-0.5 px-2 pl-[68px]"
            style={{ fontSize: "12px" }}
          />
        </label>
        {!hideExtraFields && (
          <label className="text-gray-500 font-bold mb-2 relative flex">
            <span className="absolute top-[5px] left-[1px] bottom-[1px] px-[7px] bg-gray-200 flex items-center rounded-l-[5px]">
              By
            </span>
            <input
              type="text"
              {...register(`images.${i}.by` as const)}
              className="form-input py-0.5 pr-2 pl-[35px] max-w-[50%]"
              style={{ fontSize: "12px" }}
            />
          </label>
        )}
        {!hideExtraFields && (
          <label className="text-gray-500 font-bold block mt-2">
            <input
              type="checkbox"
              {...register(`images.${i}.isMap` as const)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            &nbsp;&nbsp;Map image
          </label>
        )}
      </div>
      <button
        type="button"
        tabIndex={-1}
        className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-700/90 p-1.5 rounded-full flex items-center justify-center absolute -left-2 -top-2 shadow"
        onClick={() => handleDelete(i, smUrl, !!isNew)}
      >
        <TrashIcon className="h-4 w-4 text-white opacity-80" />
      </button>
    </article>
  );
}
