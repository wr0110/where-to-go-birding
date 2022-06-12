import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, limit, getDocs, orderBy } from "firebase/firestore"; 

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function getHotspotByLocationId(id: string) {
	const docRef = doc(db, "hotspots", id);
	const snapshot = await getDoc(docRef);
	if (snapshot.exists()) {
		return snapshot.data();
	}
}

export async function getHotspot(countySlug: string, slug: string) {
	const collectionRef = collection(db, "hotspots");
	const q = query(collectionRef, where("countySlug", "==", countySlug), where("slug", "==", slug), limit(1));
	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		return snapshot.docs[0].data();
	}
}

export async function getHotspots(countySlug: string) {
	//TODO: Exclude about, tips, etc. ---------------------------------------------------------------------------------------------------------------------
	if (!countySlug) return null;
	const collectionRef = collection(db, "hotspots");
	const q = query(collectionRef, where("countySlug", "==", countySlug));
	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		return snapshot.docs.map(item => item.data());
	}
}

export async function getRoadsideHotspots(stateCode: string) {
		//TODO: Exclude about, tips, etc. ---------------------------------------------------------------------------------------------------------------------
	if (!stateCode) return null;
	const collectionRef = collection(db, "hotspots");
	const q = query(collectionRef, where("stateCode", "==", `US-${stateCode}`), where("roadside", "==", "Yes"));
	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		return snapshot.docs.map(item => item.data());
	}
}

export async function getDayHikeHotspots(stateCode: string) {
		//TODO: Exclude about, tips, etc. ---------------------------------------------------------------------------------------------------------------------
	if (!stateCode) return null;
	const collectionRef = collection(db, "hotspots");
	const q = query(collectionRef, where("dayhike", "==", "Yes"));
	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		return snapshot.docs.map(item => item.data());
	}
}

export async function getAccessibleHotspots(stateCode: string) {
		//TODO: Exclude about, tips, etc. ---------------------------------------------------------------------------------------------------------------------
	if (!stateCode) return null;
	const collectionRef = collection(db, "hotspots");
	const q = query(collectionRef, where("stateCode", "==", `US-${stateCode}`), where("accessible", "in", ["ABA", "Birdability"]));
	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		return snapshot.docs.map(item => item.data());
	}
}

export async function getHotspotsByState(stateCode: string) {
		//TODO: Exclude about, tips, etc. ---------------------------------------------------------------------------------------------------------------------
	if (!stateCode) return null;
	const collectionRef = collection(db, "hotspots");
	const q = query(collectionRef, where("stateCode", "==", `US-${stateCode}`), orderBy("name"));
	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		return snapshot.docs.map(item => item.data());
	}
}

export async function saveHotspot(id: string, data: any) {
	await setDoc(doc(db, "hotspots", id), data);
}