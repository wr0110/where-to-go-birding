import { useFormContext, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { tinyConfig } from "lib/helpers";

type InputProps = {
  name: string;
  defaultValue?: string;
  [x: string]: any;
};

const TinyMCE = ({ name, defaultValue, ...props }: InputProps) => {
  const { control } = useFormContext();
  return (
    <div className="mt-1">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange } }) => {
          return (
            <Editor
              id={name}
              initialValue={defaultValue || ""}
              init={tinyConfig}
              onEditorChange={onChange}
              {...props}
            />
          );
        }}
      />
    </div>
  );
};

export default TinyMCE;
