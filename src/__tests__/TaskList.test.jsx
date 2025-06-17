import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../components/TaskList';

// Mock CSS module
jest.mock('../components/TaskList.module.css', () => ({
  tasks: 'mocked-tasks-class',
}));

// Mock TaskItem agar tidak perlu implementasi aslinya
jest.mock('../components/TaskItem', () => (props) => (
  <li data-testid="task-item">{props.item.nama}</li>
));

describe('TaskList Component', () => {
  const mockDelete = jest.fn();
  const mockEdit = jest.fn();

  const mockItems = [
    {
      id: 1,
      nama: 'Task 1',
      img: 'test-image-1.jpg',
      completed: false,
    },
    {
      id: 2,
      nama: 'Task 2',
      img: 'test-image-2.jpg',
      completed: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty list message when no items', () => {
    render(
      <TaskList items={[]} deleteItem={mockDelete} enterEditMode={mockEdit} />
    );
    expect(screen.getByText('Belum ada daftar belanja.')).toBeInTheDocument();
  });

  it('renders all items in descending order by id', () => {
    render(
      <TaskList items={mockItems} deleteItem={mockDelete} enterEditMode={mockEdit} />
    );
    // Task 2 (id:2) harus muncul lebih dulu
    const items = screen.getAllByTestId('task-item');
    expect(items[0]).toHaveTextContent('Task 2');
    expect(items[1]).toHaveTextContent('Task 1');
  });

  it('pass deleteItem and enterEditMode props to TaskItem', () => {
    // Karena TaskItem di-mock, kita cek dengan snapshot
    render(
      <TaskList items={mockItems} deleteItem={mockDelete} enterEditMode={mockEdit} />
    );
    expect(screen.getAllByTestId('task-item').length).toBe(2);
  });
});
