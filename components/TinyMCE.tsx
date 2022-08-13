import { useFormContext, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { tinyConfig } from "lib/helpers";

type InputProps = {
  name: string;
  defaultValue?: string;
  config?: any;
  [x: string]: any;
};

const TinyMCE = ({ name, defaultValue, config, ...props }: InputProps) => {
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
              init={config || tinyConfig}
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
