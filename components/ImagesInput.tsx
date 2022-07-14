import { useFormContext, useFieldArray } from "react-hook-form";
import { TrashIcon } from "@heroicons/react/outline";
import Uppy from "components/Uppy";
import useSecureFetch from "hooks/useSecureFetch";

export default function ImagesInput() {
  const secureFetch = useSecureFetch();
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: "images", control });

  const handleDelete = async (i: number, url: string, isNew: boolean) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    remove(i);
    if (isNew) {
      const filename = url.split("/").pop();
      const fileId = filename?.split("_")[0];
      secureFetch(`/api/file/delete?fileId=${fileId}`, "GET");
    }
  };

  return (
    <div className="mt-2">
      {!!fields.length && (
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          {fields.map((field: any, i) => {
            const isVertical = field.height > field.width;
            return (
              <article key={field.id} className="flex flex-col gap-2 rounded bg-gray-50 relative group">
                <img
                  src={field.preview || field.smUrl}
                  className={`w-full h-[240px] bg-zinc-700 object-${isVertical ? "contain" : "cover"} rounded`}
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
                  <label className="text-gray-500 font-bold block mt-2">
                    <input
                      type="checkbox"
                      {...register(`images.${i}.isMap` as const)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    &nbsp;&nbsp;Map image
                  </label>
                </div>
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-700/90 p-1.5 rounded-full flex items-center justify-center absolute -left-2 -top-2 shadow"
                  onClick={() => handleDelete(i, field.smUrl, field.isNew)}
                >
                  <TrashIcon className="h-4 w-4 text-white opacity-80" />
                </button>
              </article>
            );
          })}
        </div>
      )}

      <Uppy onSuccess={(result) => append(result)} />
    </div>
  );
}
