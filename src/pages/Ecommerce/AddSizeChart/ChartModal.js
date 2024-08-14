import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const ChartModal = ({ isOpen, onRequestClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState([['']]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setRows(initialData.data);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setRows([['']]);
  };

  const addRow = () => setRows([...rows, Array(rows[0].length).fill('')]);
  const removeRow = () => rows.length > 1 && setRows(rows.slice(0, -1));
  const addColumn = () => setRows(rows.map(row => [...row, '']));
  const removeColumn = () => rows[0].length > 1 && setRows(rows.map(row => row.slice(0, -1)));

  const handleInputChange = (rowIndex, colIndex, value) => {
    setRows(rows.map((row, rIndex) => 
      row.map((col, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? value : col))
    ));
  };

  const handleSave = () => {
    onSave({ title, data: rows });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 bg-white p-6 max-w-5xl mx-auto my-24 rounded-md shadow-md z-[1000]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <h2 className="text-lg font-bold mb-4">{initialData ? 'Edit Chart' : 'Create Chart'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Chart Title</label>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 mb-4 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="flex justify-between mb-4">
        <button onClick={removeRow} className="bg-red-200 text-red-600 px-4 py-2 rounded">- row</button>
        <button onClick={addRow} className="bg-green-200 text-green-600 px-4 py-2 rounded">+ row</button>
        <button onClick={removeColumn} className="bg-red-200 text-red-600 px-4 py-2 rounded">- column</button>
        <button onClick={addColumn} className="bg-green-200 text-green-600 px-4 py-2 rounded">+ column</button>
      </div>
      <div className="mt-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex mb-2">
            {row.map((col, colIndex) => (
              <input
                key={colIndex}
                type="text"
                value={col}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                placeholder="data"
                className="p-2 border border-gray-300 rounded mr-2 flex-1"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </div>
    </Modal>
  );
};

export default ChartModal;
