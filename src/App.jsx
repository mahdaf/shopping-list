import { useState } from 'react';

// custom hooks
import useLocalStorage from './hooks/useLocalStorage';

// custom components
import CustomForm from './components/CustomForm';
import EditForm from './components/EditForm';
import TaskList from './components/TaskList';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  const [items, setItems] = useLocalStorage('shopping-list.items', []);
  const [editedItem, setEditedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const addItem = (item) => {
    setItems(prevState => [...prevState, item]);
  };

  const deleteItem = (id) => {
    setItems(prevState => prevState.filter(i => i.id !== id));
  };

  const updateItem = (item) => {
    setItems(prevState => prevState.map(i => (
      i.id === item.id ? { ...i, ...item } : i
    )));
    setIsEditing(false); // Close edit mode
    setEditedItem(null); // Clear edited item
  };

  const enterEditMode = (item) => {
    setEditedItem(item); // Set the item to be edited
    setIsEditing(true); // Open edit mode
  };

  return (
    <div className="container">
      <header>
        <h1>Daftar Belanja Saya</h1>
      </header>
      {isEditing && (
        <EditForm
          editedTask={editedItem} // Pass the edited item
          updateTask={updateItem} // Pass the update function
          closeEditMode={() => setIsEditing(false)} // Close edit mode
        />
      )}
      <CustomForm addItem={addItem} />
      {items && (
        <TaskList
          items={items}
          deleteItem={deleteItem}
          enterEditMode={enterEditMode} // Pass the edit mode function
        />
      )}
      <ThemeSwitcher />
    </div>
  );
}

export default App;