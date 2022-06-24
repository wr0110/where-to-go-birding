import { auth } from "lib/firebaseAuth";
	
export default function useFetch()  {
	return async (url: string, method: string, data?: any) => {
		const token = await auth.currentUser?.getIdToken();
		if (!token) return;
		const response = await fetch(url, {
			method: method,
			headers: {
				Authorization: token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		return await response.json(); 
	}
}