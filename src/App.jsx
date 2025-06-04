import { useState } from 'react';
import { auth } from '../firebase';

// custom hooks
import useFirestoreCollection from './hooks/useFirestoreCollection';

// custom components
import CustomForm from './components/CustomForm';
import EditForm from './components/EditForm';
import TaskList from './components/TaskList';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useFirestoreCollection();
  const [editedItem, setEditedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Ambil nama user dari email
  const user = auth.currentUser;
  const userName = user && user.email ? user.email.split('@')[0] : "User";

  // Validasi dan tambah item
  const handleAddItem = (item) => {
    if (!item.nama || !item.harga || !item.jumlah) {
      alert("Semua field harus diisi!");
      return;
    }
    const newItem = {
      nama: item.nama,
      harga: item.harga,
      jumlah: item.jumlah,
      img: item.img
    };
    addItem(newItem);
  };

  // Update item
  const handleUpdateItem = (item) => {
    updateItem({
      id: item.id,
      nama: item.nama,
      harga: item.harga,
      jumlah: item.jumlah,
      img: item.img
    });
    setIsEditing(false);
    setEditedItem(null);
  };

  // Delete item
  const handleDeleteItem = (id) => {
    deleteItem(id);
  };

  // Toggle purchased
  const handleTogglePurchased = (id) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateItem({ ...item, isPurchased: !item.isPurchased });
    }
  };

  const enterEditMode = (item) => {
    setEditedItem(item);
    setIsEditing(true);
  };

  const filteredItems = items.filter(item =>
    item.nama && item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Logout handler
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      auth.signOut();
    }
};

return (
  <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Daftar Belanja {userName}</h1>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </header>
      {isEditing && (
        <EditForm
          editedTask={editedItem}
          updateTask={handleUpdateItem}
          closeEditMode={() => setIsEditing(false)}
        />
      )}
      <CustomForm addItem={handleAddItem} />
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Cari nama barang..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : filteredItems && (
        <TaskList
          items={filteredItems}
          deleteItem={handleDeleteItem}
          enterEditMode={enterEditMode}
          togglePurchased={handleTogglePurchased}
        />
      )}
      <ThemeSwitcher />
    </div>
  );
}

export default App;