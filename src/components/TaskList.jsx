import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// component import
import TaskItem from './TaskItem';

// styles
import styles from './TaskList.module.css';

const TaskList = ({ items, deleteItem, enterEditMode }) => {
  return (
    <ul className={styles.tasks}>
      {items.length === 0 ? (
        <p>Belum ada daftar belanja.</p>
      ) : (
        items.sort((a, b) => b.id - a.id).map(item => (
          <TaskItem
            key={item.id}
            item={item}
            deleteItem={deleteItem}
            enterEditMode={enterEditMode}
          />
        ))
      )}
    </ul>
  );
};

export default TaskList;

if (process.env.NODE_ENV === 'test') {
  describe('TaskList Component', () => {
    const mockItems = [
      {
        id: 1,
        nama: 'Task 1',
        img: 'test-image-1.jpg',
        completed: false
      },
      {
        id: 2,
        nama: 'Task 2',
        img: 'test-image-2.jpg',
        completed: true
      }
    ];

    test('renders empty list when no items', () => {
      render(<TaskList items={[]} />);
      expect(screen.getByText('Belum ada daftar belanja.')).toBeInTheDocument();
    });

    test('renders list of items', () => {
      render(<TaskList items={mockItems} />);
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });
}
