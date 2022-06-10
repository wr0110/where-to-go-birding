type AuthErrorProps = {
	children: React.ReactNode,
}

export default function AuthError({children}: AuthErrorProps) {
	return <div className="bg-yellow-200 p-4 rounded">{children}</div>
}