import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkJXuYqanrr-E59vZWCNgpy-PqRtO2XHU",
  authDomain: "buletin-fbe3c.firebaseapp.com",
  projectId: "buletin-fbe3c",
  storageBucket: "buletin-fbe3c.appspot.com",
  messagingSenderId: "178317423752",
  appId: "1:178317423752:web:c00f182de4c1a33a4adb3d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const saveBuletin = async ({
  userId,
  userName,
  title,
  subtitle,
  category,
  buletinName,
  content,
  isPublic = true,
  buletinProfileImage = '',
  buletinsId = '',
}) => {
  try {
    const docRef = await addDoc(collection(db, "buletin"), {
      userId,
      userName,
      buletinName,
      category,
      title,
      subtitle,
      content,
      isPublic,
      buletinProfileImage,
      buletinsId,
      createdAt: serverTimestamp(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error menyimpan buletin: ", error);
    throw error;
  }
};

