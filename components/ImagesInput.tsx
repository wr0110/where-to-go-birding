import { useFormContext, useFieldArray } from "react-hook-form";
import { TrashIcon } from "@heroicons/react/outline";
import Uppy from "components/Uppy";
import useSecureFetch from "hooks/useSecureFetch";

export default function ImagesInput() {
	const secureFetch = useSecureFetch();
	const { control, register } = useFormContext();
	const { fields, append, remove } = useFieldArray({ name: "images", control });

	const handleDelete = async (i:number, url: string) => {
		const filename = url.split("/").pop();
		const fileId = filename?.split("_")[0];
		if (!confirm("Are you sure you want to delete this image?")) return;
		remove(i);
		secureFetch(`/api/file/delete?fileId=${fileId}`, "GET");
	}

	return (
		<div className="mt-2">
			{!!fields.length &&
				<div className="grid grid-cols-2 gap-4 mb-4">
					{fields.map((field: any, i) => {
						return (
							<article key={field.id} className="flex gap-4 rounded bg-gray-50 relative group">
								<img src={field.preview || field.smUrl} className="w-[115px] h-[115px] object-cover rounded" />
								<div className="mt-2.5 pr-4">
									<label className="text-gray-500 font-bold mb-2 block">
										Photographer <br/>
										<input type="text" {...register(`images.${i}.by` as const)} className="form-input py-1" style={{ fontSize: "12px" }} />
									</label>
									<label className="text-gray-500 font-bold">
										<input type="checkbox" {...register(`images.${i}.isMap` as const)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
										&nbsp;&nbsp;Show in sidebar
									</label>
								</div>
								<button
									type="button" className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-700/90 p-1.5 rounded-full flex items-center justify-center absolute -left-2 -top-2 shadow"
									onClick={() => handleDelete(i, field.smUrl)}
								>
									<TrashIcon className="h-4 w-4 text-white opacity-80"/> 
								</button>
							</article>
						);
					})}
				</div>
			}
				
			<Uppy onSuccess={(result) => append(result)} />
		</div>
  );
};