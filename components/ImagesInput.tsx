import { useFormContext, useFieldArray } from "react-hook-form";
import Uppy from "components/Uppy";
import useSecureFetch from "hooks/useSecureFetch";
import SortableImage from "./SortableImage";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import AddStreetview from "components/AddStreetview";

type Props = {
  hideExtraFields?: boolean;
  enableStreetview?: boolean;
};

export default function ImagesInput({ hideExtraFields, enableStreetview }: Props) {
  const secureFetch = useSecureFetch();
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({ name: "images", control });

  const handleDelete = async (i: number, url: string, isNew: boolean) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    remove(i);
    if (isNew) {
      const filename = url.split("/").pop();
      const fileId = filename?.split("_")[0];
      secureFetch(`/api/file/delete?fileId=${fileId}`, "GET");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = fields.map(({ id }) => id);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    move(oldIndex, newIndex);
  }

  return (
    <div className="mt-2">
      {!!fields.length && (
        <div className="grid lg:grid-cols-2 gap-4 mb-4 sortableGrid">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={rectSortingStrategy}>
              {fields.map((field: any, i) => (
                <SortableImage
                  key={field.id}
                  i={i}
                  handleDelete={handleDelete}
                  hideExtraFields={hideExtraFields}
                  {...field}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      <Uppy onSuccess={(result) => append(result)} />
      {enableStreetview && <AddStreetview />}
    </div>
  );
}
