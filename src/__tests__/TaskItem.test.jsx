import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../components/TaskItem';

describe('TaskItem Component', () => {
  const mockTask = {
    id: 1,
    nama: 'Test Task',
    harga: 10000,
    jumlah: 2,
    img: 'test-image.jpg',
    completed: false
  };

  const mockDeleteItem = jest.fn();
  const mockEnterEditMode = jest.fn();

  beforeEach(() => {
    mockDeleteItem.mockClear();
    mockEnterEditMode.mockClear();
  });

  test('renders task title', () => {
    render(
      <TaskItem 
        item={mockTask} 
        deleteItem={mockDeleteItem}
        enterEditMode={mockEnterEditMode}
      />
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('renders task details', () => {
    render(
      <TaskItem 
        item={mockTask} 
        deleteItem={mockDeleteItem}
        enterEditMode={mockEnterEditMode}
      />
    );
    expect(screen.getByText('Nama:')).toBeInTheDocument();
    expect(screen.getByText('Harga:')).toBeInTheDocument();
    expect(screen.getByText('Jumlah:')).toBeInTheDocument();
    expect(screen.getByText('Rp10000')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('calls deleteItem when delete button is clicked', () => {
    render(
      <TaskItem 
        item={mockTask} 
        deleteItem={mockDeleteItem}
        enterEditMode={mockEnterEditMode}
      />
    );
    
    const deleteButton = screen.getByLabelText('Delete Test Task');
    fireEvent.click(deleteButton);
    
    expect(mockDeleteItem).toHaveBeenCalledWith(1);
  });

  test('calls enterEditMode when edit button is clicked', () => {
    render(
      <TaskItem 
        item={mockTask} 
        deleteItem={mockDeleteItem}
        enterEditMode={mockEnterEditMode}
      />
    );
    
    const editButton = screen.getByLabelText('Update Test Task');
    fireEvent.click(editButton);
    
    expect(mockEnterEditMode).toHaveBeenCalledWith(mockTask);
  });
}); 