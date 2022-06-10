import * as React from "react";
import { useUser } from "providers/user";

type PropTypes = {
	children: React.ReactNode,
}

export default function SecureContent({children}: PropTypes) {
	const { user } = useUser();
	return user ? <>{children}</> : <></>;
}