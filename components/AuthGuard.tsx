import * as React from "react";
import { useRouter } from "next/router";
import { useUser } from "providers/user";

type PropTypes = {
	children: React.ReactNode,
}

export default function AuthGuard({children}: PropTypes) {
	const { user, loading } = useUser();
	const router = useRouter();
	const isLoading = loading || typeof window === "undefined";
	
	if (!loading && !user) {
		router.push("/admin/login");
	}

	if (isLoading || !user) return <></>;
	return <>{children}</>
}