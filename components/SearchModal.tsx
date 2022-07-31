import * as React from "react";
import Search from "components/Search";

type Option = {
  value: string;
  label: string;
};

type Props = {
  onClose: () => void;
  [x: string]: any;
};

export default function SearchModal({ onClose, ...props }: Props) {
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, []);

  React.useEffect(() => setIsMounted(true), []);

  return (
    <>
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 transition-opacity bg-black z-[10001] ${
          isMounted ? "opacity-40" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div className="absolute top-[10%] max-w-lg left-0 right-0 mx-auto z-[10002] p-8">
        <Search onChange={onClose} {...props} />
      </div>
    </>
  );
}
