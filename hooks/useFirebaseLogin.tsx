import * as React from "react";
import { auth } from "lib/firebaseAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
	
export default function useFirebaseLogin()  {
	const [error, setError] = React.useState<any>();
	const [loading, setLoading] = React.useState(false);
	
	const login = async (email: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			await signInWithEmailAndPassword(auth, email, password);
			return true;
		} catch (error) {
			setError(error);
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return { login, loading, error };
}