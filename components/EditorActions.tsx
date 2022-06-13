import * as React from "react";
import { useUser } from "providers/user";

type PropTypes = {
	children: React.ReactNode,
	className?: string,
}

export default function EditorActions({ children, className }: PropTypes) {
	const { user } = useUser();
	if (!user) return <></>
	return (
		<div className={`border my-4 border-[#92ad39] ${className || ""}`}>
			<h3 className="p-2 font-bold pb-2 border-b bg-[#92ad39] text-white">Editor Actions</h3>
			<div className="p-2">{children}</div>
		</div>
	)
}