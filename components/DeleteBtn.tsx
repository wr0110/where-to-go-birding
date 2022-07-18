import { useRouter } from "next/router";
import useSecureFetch from "hooks/useSecureFetch";

type Props = {
  className?: string;
  entity: string;
  url: string;
  children: React.ReactNode;
};

export default function DeleteBtn({ className, entity, url, children }: Props) {
  const router = useRouter();
  const secureFetch = useSecureFetch();
  const handleClick = async () => {
    if (!confirm(`Are you sure you want to delete this ${entity.toLowerCase()}?`)) return;
    await secureFetch(url, "GET");
    router.push("/");
  };

  return (
    <button type="button" onClick={handleClick} className={`text-red-600 ${className || ""}`}>
      {children}
    </button>
  );
}
