import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChartTable = () => {
  const [charts, setCharts] = useState([]);
  const [editingChart, setEditingChart] = useState(null);
  const [newChart, setNewChart] = useState({ title: '', rows: 1, columns: 1, data: [] });

  useEffect(() => {
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    try {
      const response = await axios.get('/api/charts');
      setCharts(response.data);
    } catch (error) {
      console.error('Error fetching charts:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/charts/${id}`);
      fetchCharts();
    } catch (error) {
      console.error('Error deleting chart:', error);
    }
  };

  const handleEdit = (chart) => {
    setEditingChart(chart);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/charts/${editingChart._id}`, editingChart);
      setEditingChart(null);
      fetchCharts();
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  };

  const handleAddChart = async () => {
    try {
      await axios.post('/api/charts', newChart);
      setNewChart({ title: '', rows: 1, columns: 1, data: [] });
      fetchCharts();
    } catch (error) {
      console.error('Error adding chart:', error);
    }
  };

  const handleRowChange = (rowIndex, columnIndex, value) => {
    const updatedData = [...editingChart.data];
    if (!updatedData[rowIndex]) {
      updatedData[rowIndex] = { rowIndex, columns: Array(editingChart.columns).fill('') };
    }
    updatedData[rowIndex].columns[columnIndex] = value;
    setEditingChart({ ...editingChart, data: updatedData });
  };

  const handleAddRow = () => {
    const newRow = { rowIndex: editingChart.data.length, columns: Array(editingChart.columns).fill('') };
    setEditingChart({ ...editingChart, data: [...editingChart.data, newRow], rows: editingChart.rows + 1 });
  };

  const handleAddColumn = () => {
    const updatedData = editingChart.data.map(row => ({
      ...row,
      columns: [...row.columns, '']
    }));
    setEditingChart({ ...editingChart, data: updatedData, columns: editingChart.columns + 1 });
  };

  const handleNewRowChange = (rowIndex, columnIndex, value) => {
    const updatedData = [...newChart.data];
    if (!updatedData[rowIndex]) {
      updatedData[rowIndex] = { rowIndex, columns: Array(newChart.columns).fill('') };
    }
    updatedData[rowIndex].columns[columnIndex] = value;
    setNewChart({ ...newChart, data: updatedData });
  };

  const handleNewAddRow = () => {
    const newRow = { rowIndex: newChart.data.length, columns: Array(newChart.columns).fill('') };
    setNewChart({ ...newChart, data: [...newChart.data, newRow], rows: newChart.rows + 1 });
  };

  const handleNewAddColumn = () => {
    const updatedData = newChart.data.map(row => ({
      ...row,
      columns: [...row.columns, '']
    }));
    setNewChart({ ...newChart, data: updatedData, columns: newChart.columns + 1 });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chart List</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Rows</th>
            <th className="py-2 px-4 border-b">Columns</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {charts.map((chart) => (
            <tr key={chart._id}>
              <td className="py-2 px-4 border-b">{chart.title}</td>
              <td className="py-2 px-4 border-b">{chart.rows}</td>
              <td className="py-2 px-4 border-b">{chart.columns}</td>
              <td className="py-2 px-4 border-b">
                <button className="text-blue-500 hover:underline mr-2" onClick={() => handleEdit(chart)}>
                  Edit
                </button>
                <button className="text-red-500 hover:underline" onClick={() => handleDelete(chart._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingChart && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="text-xl mb-2">Edit Chart</h2>
          <input
            type="text"
            value={editingChart.title}
            onChange={(e) => setEditingChart({ ...editingChart, title: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          {editingChart.data.map((row, rowIndex) => (
            <div key={rowIndex} className="mb-2">
              {row.columns.map((col, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  value={col}
                  onChange={(e) => handleRowChange(rowIndex, colIndex, e.target.value)}
                  className="border p-2 mb-2 w-full"
                  placeholder={`Row ${rowIndex + 1} Column ${colIndex + 1}`}
                />
              ))}
            </div>
          ))}
          <button onClick={handleAddRow} className="bg-green-500 text-white p-2 rounded mr-2">
            Add Row
          </button>
          <button onClick={handleAddColumn} className="bg-green-500 text-white p-2 rounded">
            Add Column
          </button>
          <button onClick={handleSaveEdit} className="bg-blue-500 text-white p-2 rounded ml-2">
            Save
          </button>
        </div>
      )}

      <div className="mt-4 p-4 border rounded bg-gray-50">
        <h2 className="text-xl mb-2">Add New Chart</h2>
        <input
          type="text"
          placeholder="Title"
          value={newChart.title}
          onChange={(e) => setNewChart({ ...newChart, title: e.target.value })}
          className="border p-2 mb-2 w-full"
        />
        {newChart.data.map((row, rowIndex) => (
          <div key={rowIndex} className="mb-2">
            {row.columns.map((col, colIndex) => (
              <input
                key={colIndex}
                type="text"
                value={col}
                onChange={(e) => handleNewRowChange(rowIndex, colIndex, e.target.value)}
                className="border p-2 mb-2 w-full"
                placeholder={`Row ${rowIndex + 1} Column ${colIndex + 1}`}
              />
            ))}
          </div>
        ))}
        <button onClick={handleNewAddRow} className="bg-green-500 text-white p-2 rounded mr-2">
          Add Row
        </button>
        <button onClick={handleNewAddColumn} className="bg-green-500 text-white p-2 rounded">
          Add Column
        </button>
        <button onClick={handleAddChart} className="bg-blue-500 text-white p-2 rounded ml-2">
          Add Chart
        </button>
      </div>
    </div>
  );
};

export default ChartTable;
