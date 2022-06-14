import { useRouter } from "next/router";
import useSecureFetch from "hooks/useSecureFetch";

type Props = {
	id: string,
	className?: string,
}

export default function AboutSection({ id, className }: Props) {
	const router = useRouter();
	const secureFetch = useSecureFetch();
	const handleClick = async () => {
		if (!confirm("Are you sure you want to delete this hotspot?")) return;
		await secureFetch(`/api/hotspot/delete?id=${id}`, "GET");
		router.push("/");
	}

	return (
		<button type="button" onClick={handleClick} className={`text-red-600 ${className || ""}`}>Delete Hotspot</button>
	)
}