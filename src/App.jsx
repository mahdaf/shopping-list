import { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

// customs hooks
import useFirestoreCollection from './hooks/useFirestoreCollection';

// custom components
import CustomForm from './components/CustomForm';
import EditForm from './components/EditForm';
import TaskList from './components/TaskList';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  const navigate = useNavigate();
  const { items, loading, error, addItem, updateItem, deleteItem } = useFirestoreCollection();
  const [editedItem, setEditedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');

  const user = auth.currentUser;
  const userNameRaw = user && user.email ? user.email.split('@')[0] : "User";
  const userName = userNameRaw.charAt(0).toUpperCase() + userNameRaw.slice(1);

  const handleAddItem = (item) => {
    if (!item.nama || !item.harga || !item.jumlah) {
      alert("Semua field harus diisi!");
      return;
    }
    addItem({ ...item });
  };

  const handleUpdateItem = (item) => {
    updateItem({ ...item });
    setIsEditing(false);
    setEditedItem(null);
  };

  const handleDeleteItem = (id) => {
    deleteItem(id);
  };

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

  // Funtion to sort items
  const sortItems = (itemsToSort) => {
    return [...itemsToSort].sort((a, b) => {
      switch (sortOption) {
        case 'default':
          return 0; // Tidak mengurutkan
        case 'nama-asc':
          return a.nama.localeCompare(b.nama);
        case 'nama-desc':
          return b.nama.localeCompare(a.nama);
        case 'harga-asc':
          return parseFloat(a.harga) - parseFloat(b.harga);
        case 'harga-desc':
          return parseFloat(b.harga) - parseFloat(a.harga);
        case 'jumlah-asc':
          return parseInt(a.jumlah) - parseInt(b.jumlah);
        case 'jumlah-desc':
          return parseInt(b.jumlah) - parseInt(a.jumlah);
        default:
          return 0;
      }
    });
  };

  const sortedAndFilteredItems = sortItems(filteredItems);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      auth.signOut().then(() => {
        navigate("/login");
      });
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

      <div className="search-sort-wrapper">
       
        
        <div className="sort-wrapper">
          <select
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default (Urutan Asli)</option>
            <option value="nama-asc">Nama Barang (A-Z)</option>
            <option value="nama-desc">Nama Barang (Z-A)</option>
            <option value="harga-asc">Harga (Termurah)</option>
            <option value="harga-desc">Harga (Termahal)</option>
            <option value="jumlah-asc">Jumlah (Sedikit)</option>
            <option value="jumlah-desc">Jumlah (Banyak)</option>
          </select>
        </div>
        
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Cari nama ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <TaskList
          items={sortedAndFilteredItems}
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