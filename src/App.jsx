import { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

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
  const idleTimer = useRef(null);

  const user = auth.currentUser;
  const userNameRaw = user && user.email ? user.email.split('@')[0] : "User";
  const userName = userNameRaw.charAt(0).toUpperCase() + userNameRaw.slice(1);


  useEffect(() => {
    const logoutUser = () => {
      alert("Anda telah logout karena tidak ada aktivitas selama 1 menit.");
      auth.signOut().then(() => {
        navigate("/login");
      });
    };

    const resetTimer = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(logoutUser, 600 * 1000); // 1 menit
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // inisialisasi timer

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(idleTimer.current);
    };
  }, [navigate]);

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
        <h1>Daftar Beli {userName}</h1>
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
      ) : (
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

if (process.env.NODE_ENV === 'test') {
  describe('App Component', () => {
    it('renders without crashing', () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
      const heading = screen.getByRole('heading', { name: /Daftar Belanja/i });
      expect(heading).toBeInTheDocument();
    });
  });
}
