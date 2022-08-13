import { useFormContext, useFieldArray } from "react-hook-form";
import Field from "components/Field";
import HotspotSelect from "./HotspotSelect";
import TinyMCE from "components/TinyMCE";

type Props = {
  stateCode: string;
};

const InputDrives = ({ stateCode }: Props) => {
  const { control } = useFormContext();
  const { fields, append, remove, insert } = useFieldArray({ name: "entries", control });
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => {
        //@ts-ignore
        const description = field.description;
        return (
          <>
            {fields.length > 0 && (
              <div className="group text-center -my-4 py-4">
                <button
                  type="button"
                  className="bg-gray-700 py-0.5 px-4 text-xs rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => insert(index, { hotspotSelect: "", description: "" })}
                >
                  + Add Hotspot
                </button>
              </div>
            )}
            <section className="rounded bg-gray-50 p-4" key={field.id}>
              <div className="flex flex-col gap-4">
                <Field label="Hotspot">
                  <HotspotSelect name={`entries.${index}.hotspotSelect`} stateCode={stateCode} required />
                </Field>
                <Field label="Description">
                  <TinyMCE name={`entries.${index}.description`} defaultValue={description} />
                </Field>
              </div>
              <div className="flex items-center justify-end">
                <button type="button" className="text-red-700 mt-2" onClick={() => remove(index)}>
                  Remove
                </button>
              </div>
            </section>
          </>
        );
      })}
      <div className="text-center">
        <button
          type="button"
          className="bg-gray-700 py-1 px-4 text-sm rounded text-white mt-4"
          onClick={() => append({ hotspotSelect: "", description: "" })}
        >
          + Add Hotspot
        </button>
      </div>
    </div>
  );
};

export default InputDrives;
