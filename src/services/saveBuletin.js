import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Menyimpan dokumen buletin ke Firestore
 * @param {Object} data - Data buletin yang akan disimpan
 * @returns {string} - ID dokumen buletin yang baru
 */
export const saveBuletin = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), data);
    console.log('Buletin berhasil disimpan dengan ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Gagal menyimpan buletin:', error);
    throw error;
  }
};
