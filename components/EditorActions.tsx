import * as React from "react";
import { useUser } from "providers/user";

type PropTypes = {
  children: React.ReactNode;
  className?: string;
};

export default function EditorActions({ children, className }: PropTypes) {
  const { user } = useUser();
  if (!user) return <></>;
  return (
    <div className={`border mb-6 border-t-0 -mt-16 ${className || ""}`}>
      <div className="p-2 flex gap-6 text-xs">{children}</div>
    </div>
  );
}
