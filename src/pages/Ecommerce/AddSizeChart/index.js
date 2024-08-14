import React, { useEffect, useState } from 'react';
import ChartModal from './ChartModal';
import axios from 'axios';
import baseUrl from '../../../helpers/baseUrl';

const Chart = () => {
  const [charts, setCharts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChart, setCurrentChart] = useState(null);

  useEffect(() => {
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/charts`);
      setCharts(data);
    } catch (error) {
      console.error('Error fetching charts:', error);
    }
  };

  const handleSave = async (chart) => {
    try {
      if (currentChart) {
        await axios.put(`${baseUrl}/api/charts/${currentChart._id}`, chart);
      } else {
        await axios.post(`${baseUrl}/api/charts`, chart);
      }
      fetchCharts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving chart:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/charts/${id}`);
      fetchCharts();
    } catch (error) {
      console.error('Error deleting chart:', error);
    }
  };

  const handleOpenModal = (chart = null) => {
    setCurrentChart(chart);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentChart(null);
  };

  return (
    <div className="p-6 mt-20">
      <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Add Chart
      </button>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Index</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Data</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {charts.map((chart, index) => (
            <tr key={chart._id}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{chart.title}</td>
              <td className="py-2 px-4 border-b">
                <table>
                  <tbody>
                    {chart.data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="py-2 px-4 border-b">
                            <p className="p-2 border">{cell}</p>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleOpenModal(chart)} className="bg-yellow-200 text-yellow-600 px-4 py-2 rounded mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(chart._id)} className="bg-red-200 text-red-600 px-4 py-2 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <ChartModal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          onSave={handleSave}
          initialData={currentChart}
        />
      )}
    </div>
  );
};

export default Chart;
