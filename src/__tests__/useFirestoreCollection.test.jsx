import { useEffect, useState } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import React from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import useFirestoreCollection from "../hooks/useFirestoreCollection";
import * as firestore from "firebase/firestore";

// Mock firebase/firestore
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  onSnapshot: jest.fn((...args) => {
    // args[1] adalah callback sukses
    if (typeof args[1] === "function") {
      args[1]({
        docs: [
          {
            id: "1",
            data: () => ({
              nama: "Barang 1",
              harga: 1000,
              jumlah: 2,
              img: "img",
              uid: "test-uid"
            })
          }
        ]
      });
    }
    return () => {}; // <--- ini penting!
  }),
  query: jest.fn(),
  where: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock auth
jest.mock("../../firebase", () => ({
  auth: {
    currentUser: { uid: "test-uid", email: "test@example.com" },
  },
  db: {
    collection: jest.fn(),
  },
}));

// Custom hook untuk CRUD ke koleksi 'barang'
// const useFirestoreColle ction = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!auth.currentUser) {
//       setItems([]);
//       setLoading(false);
//       return;
//     }
//     // Query hanya data milik user login
//     const q = query(
//       collection(db, "barang"),
//       where("uid", "==", auth.currentUser.uid)
//     );
//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const data = snapshot.docs.map(doc => ({
//           id: doc.id,
//           harga: doc.data().harga,
//           img: doc.data().img,
//           jumlah: doc.data().jumlah,
//           nama: doc.data().nama
//         }));
//         setItems(data);
//         setLoading(false);
//       },
//       (err) => {
//         setError(err.message);
//         setLoading(false);
//       }
//     );
//     return () => unsubscribe();
//   }, []);

//   // CREATE
//   const addItem = async (item) => {
//     try {
//       await addDoc(collection(db, "barang"), {
//         harga: item.harga,
//         img: item.img,
//         jumlah: item.jumlah,
//         nama: item.nama,
//         uid: auth.currentUser?.uid // simpan UID user
//       });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // UPDATE
//   const updateItem = async (item) => {
//     try {
//       const itemRef = doc(db, "barang", item.id);
//       // Ambil data barang dulu
//       const itemSnap = await getDoc(itemRef); 
//       if (!itemSnap.exists()) throw new Error("Data tidak ditemukan");
//       const data = itemSnap.data();
//       if (data.uid !== auth.currentUser?.uid) {
//         throw new Error("Anda tidak berhak mengubah data ini.");
//       }
//       await updateDoc(itemRef, {
//         harga: item.harga,
//         img: item.img,
//         jumlah: item.jumlah,
//         nama: item.nama
//       });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // DELETE
//   const deleteItem = async (id) => {
//     try {
//       const itemRef = doc(db, "barang", id);
//       // Ambil data barang dulu
//       const itemSnap = await getDoc(itemRef); 
//       if (!itemSnap.exists()) throw new Error("Data tidak ditemukan");
//       const data = itemSnap.data();
//       if (data.uid !== auth.currentUser?.uid) {
//         throw new Error("Anda tidak berhak menghapus data ini.");
//       }
//       await deleteDoc(itemRef);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return { items, loading, error, addItem, updateItem, deleteItem };
// };

export default useFirestoreCollection;

if (process.env.NODE_ENV === 'test') {
  describe('useFirestoreCollection Hook', () => {
    const mockCollection = [
      { id: 1, nama: 'Task 1', img: 'test-image-1.jpg' },
      { id: 2, nama: 'Task 2', img: 'test-image-2.jpg' }
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns empty array initially', () => {
      const TestComponent = () => {
        const { items } = useFirestoreCollection('tasks');
        return <div data-testid="items">{JSON.stringify(items)}</div>;
      };

      render(<TestComponent />);
      expect(screen.getByTestId('items')).toHaveTextContent('[]');
    });

    it('handles collection updates', () => {
      const TestComponent = () => {
        const { items } = useFirestoreCollection('tasks');
        return <div data-testid="items">{JSON.stringify(items)}</div>;
      };

      // Mock Firestore collection
      const mockOnSnapshot = jest.fn((callback) => {
        callback({
          docs: mockCollection.map(item => ({
            id: item.id,
            data: () => item
          }))
        });
        return () => {};
      });

      const mockCollectionRef = {
        onSnapshot: mockOnSnapshot
      };

      jest.spyOn(db, 'collection').mockReturnValue(mockCollectionRef);

      const { rerender } = render(<TestComponent />);
      
      // Force re-render to ensure useEffect runs
      rerender(<TestComponent />);
      
      // Wait for the next tick to allow state updates
      setTimeout(() => {
        expect(screen.getByTestId('items')).toHaveTextContent(JSON.stringify(mockCollection));
      }, 0);
    });
  });
}

const TestComponent = () => {
  const { items, loading, error, addItem, updateItem, deleteItem } = useFirestoreCollection();
  return (
    <div>
      <div data-testid="items">{JSON.stringify(items)}</div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error}</div>
      <button onClick={() => addItem({ nama: "A", harga: 1, jumlah: 1, img: "img" })}>add</button>
      <button onClick={() => updateItem({ id: "1", nama: "B", harga: 2, jumlah: 2, img: "img", uid: "test-uid" })}>update</button>
      <button onClick={() => deleteItem("1")}>delete</button>
    </div>
  );
};

describe("useFirestoreCollection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    firestore.onSnapshot.mockImplementation((q, onSuccess) => {
      onSuccess({
        docs: [
          { id: "1", data: () => ({ nama: "Barang 1", harga: 1000, jumlah: 2, img: "img", uid: "test-uid" }) },
        ],
      });
      return jest.fn();
    });
  });

  it("fetches and renders items", async () => {
    render(<TestComponent />);
    await waitFor(() => {
      expect(screen.getByTestId("items")).toHaveTextContent("Barang 1");
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });

  it("handles addItem success", async () => {
    firestore.addDoc.mockResolvedValue({});
    render(<TestComponent />);
    screen.getByText("add").click();
    await waitFor(() => {
      expect(firestore.addDoc).toHaveBeenCalled();
    });
  });

  it("handles addItem error", async () => {
    firestore.addDoc.mockRejectedValue(new Error("add error"));
    render(<TestComponent />);
    screen.getByText("add").click();
    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("add error");
    });
  });

  it("handles updateItem success", async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ uid: "test-uid" }),
    });
    firestore.updateDoc.mockResolvedValue({});
    render(<TestComponent />);
    screen.getByText("update").click();
    await waitFor(() => {
      expect(firestore.updateDoc).toHaveBeenCalled();
    });
  });

  it("handles updateItem error", async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ uid: "test-uid" }),
    });
    firestore.updateDoc.mockRejectedValue(new Error("update error"));
    render(<TestComponent />);
    screen.getByText("update").click();
    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("update error");
    });
  });

  it("handles deleteItem success", async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ uid: "test-uid" }),
    });
    firestore.deleteDoc.mockResolvedValue({});
    render(<TestComponent />);
    screen.getByText("delete").click();
    await waitFor(() => {
      expect(firestore.deleteDoc).toHaveBeenCalled();
    });
  });

  it("handles deleteItem error", async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ uid: "test-uid" }),
    });
    firestore.deleteDoc.mockRejectedValue(new Error("delete error"));
    render(<TestComponent />);
    screen.getByText("delete").click();
    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("delete error");
    });
  });

  it("sets items to empty if no user", async () => {
    require("../../firebase").auth.currentUser = null;
    render(<TestComponent />);
    await waitFor(() => {
      expect(screen.getByTestId("items")).toHaveTextContent("[]");
    });
  });
});
