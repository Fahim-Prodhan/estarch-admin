import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '../../../helpers/baseUrl';

const TrackingModal = ({ isOpen, toggle, orderId }) => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (isOpen && orderId) {
            const fetchNotes = async () => {
                try {
                    const response = await axios.get(`${baseUrl}/api/orders/orders/notes/${orderId}`);
                    setNotes(response.data.notes || []);
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
            };

            fetchNotes();
        }
    }, [isOpen, orderId]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={toggle}>
            <div className="modal-content bg-white p-6 rounded shadow-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <button className="close-button text-xl font-bold float-right" onClick={toggle}>X</button>
                <h2 className="text-xl font-bold mb-4 text-center">Order Tracking</h2>

                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Note</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Created By</th>
                            <th className="px-4 py-2">Date Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.length > 0 ? (
                            notes.map((note) => (
                                <tr key={note._id}>
                                    <td className="border px-4 py-2">{note.noteContent}</td>
                                    <td className="border px-4 py-2">{note.status || 'N/A'}</td>
                                    <td className="border px-4 py-2">{note.adminName}</td>
                                    <td className="border px-4 py-2">{new Date(note.timestamp).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="border px-4 py-2" colSpan="4">No notes available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrackingModal;
