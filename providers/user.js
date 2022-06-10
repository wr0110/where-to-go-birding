import * as React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "lib/firebaseAuth";

export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
	const [user, setUser] = React.useState();
	const [loading, setLoading] = React.useState(true);

	const refreshUser = React.useCallback(async () => {
		await auth.currentUser.reload();
		setUser({...auth.currentUser});
	}, []);

	React.useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});
	}, []);

	return <UserContext.Provider value={{user, refreshUser, loading}}>{children}</UserContext.Provider>;
};

const useUser = () => {
	const state = React.useContext(UserContext);
	return { ...state };
};

export { UserProvider, useUser };