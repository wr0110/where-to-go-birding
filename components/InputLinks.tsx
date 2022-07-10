import { useFormContext, useFieldArray } from "react-hook-form";
import { TrashIcon } from "@heroicons/react/outline";

const Input = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: "links", control });
  return (
    <div>
      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <section className="flex gap-4">
              <input
                type="text"
                placeholder="Label"
                {...register(`links.${index}.label` as const, { required: true })}
                className={`form-input ${errors?.links?.[index]?.label ? "input-error" : ""}`}
              />
              <input
                type="text"
                placeholder="URL"
                {...register(`links.${index}.url` as const, { required: true })}
                className={`form-input ${errors?.links?.[index]?.url ? "input-error" : ""}`}
              />
              <button type="button" onClick={() => remove(index)}>
                <TrashIcon className="h-6 w-6 text-red-700 opacity-80" />
              </button>
            </section>
          </div>
        );
      })}
      <button
        type="button"
        className="bg-gray-700 py-1 px-4 text-sm rounded text-white mt-2"
        onClick={() => append({ label: "", url: "" })}
      >
        Add Link
      </button>
    </div>
  );
};

export default Input;
