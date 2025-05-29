import { useState } from 'react';

// styles
import styles from './TaskItem.module.css';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const TaskItem = ({ item, deleteItem, enterEditMode }) => {
  return (
    <li className={styles.task}>
      <div className={styles["task-group"]}>
<<<<<<< HEAD
        <img
          src={item.image}
          alt={item.name}
=======
        {/* Hapus checkbox */}
        <img
          src={item.img}
          alt={item.nama}
>>>>>>> daftarbelanja/master
          className={styles.image}
          style={{ width: '100px', height: '80px' }}
        />
        <div className={styles.textContainer}>
<<<<<<< HEAD
          <p><strong>Nama:</strong> {item.name}</p>
          <p><strong>Harga:</strong> Rp{item.price}</p>
          <p><strong>Jumlah:</strong> {item.quantity}</p>
=======
          <p><strong>Nama:</strong> {item.nama}</p>
          <p><strong>Harga:</strong> Rp{item.harga}</p>
          <p><strong>Jumlah:</strong> {item.jumlah}</p>
>>>>>>> daftarbelanja/master
        </div>
      </div>
      <div className={styles["task-group"]}>
        <button
          className='btn'
<<<<<<< HEAD
          aria-label={`Update ${item.name}`}
          onClick={() => enterEditMode(item)} // Call enterEditMode
=======
          aria-label={`Update ${item.nama}`}
          onClick={() => enterEditMode(item)}
>>>>>>> daftarbelanja/master
        >
          <PencilSquareIcon width={24} height={24} />
        </button>

        <button
          className={`btn ${styles.delete}`}
<<<<<<< HEAD
          aria-label={`Delete ${item.name}`}
=======
          aria-label={`Delete ${item.nama}`}
>>>>>>> daftarbelanja/master
          onClick={() => deleteItem(item.id)}
        >
          <TrashIcon width={24} height={24} />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;