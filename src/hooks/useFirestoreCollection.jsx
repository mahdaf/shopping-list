import { useEffect, useState } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

// Custom hook untuk CRUD ke koleksi 'barang'
const useFirestoreCollection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setItems([]);
      setLoading(false);
      return;
    }
    // Query hanya data milik user login
    const q = query(
      collection(db, "barang"),
      where("uid", "==", auth.currentUser.uid)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          harga: doc.data().harga,
          img: doc.data().img,
          jumlah: doc.data().jumlah,
          nama: doc.data().nama
        }));
        setItems(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // CREATE
  const addItem = async (item) => {
    try {
      await addDoc(collection(db, "barang"), {
        harga: item.harga,
        img: item.img,
        jumlah: item.jumlah,
        nama: item.nama,
        uid: auth.currentUser?.uid // simpan UID user
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // UPDATE
  const updateItem = async (item) => {
    try {
      const itemRef = doc(db, "barang", item.id);
      // Ambil data barang dulu
      const itemSnap = await getDoc(itemRef); 
      if (!itemSnap.exists()) throw new Error("Data tidak ditemukan");
      const data = itemSnap.data();
      if (data.uid !== auth.currentUser?.uid) {
        throw new Error("Anda tidak berhak mengubah data ini.");
      }
      await updateDoc(itemRef, {
        harga: item.harga,
        img: item.img,
        jumlah: item.jumlah,
        nama: item.nama
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // DELETE
  const deleteItem = async (id) => {
    try {
      const itemRef = doc(db, "barang", id);
      // Ambil data barang dulu
      const itemSnap = await getDoc(itemRef); 
      if (!itemSnap.exists()) throw new Error("Data tidak ditemukan");
      const data = itemSnap.data();
      if (data.uid !== auth.currentUser?.uid) {
        throw new Error("Anda tidak berhak menghapus data ini.");
      }
      await deleteDoc(itemRef);
    } catch (err) {
      setError(err.message);
    }
  };

  return { items, loading, error, addItem, updateItem, deleteItem };
};

export default useFirestoreCollection;
