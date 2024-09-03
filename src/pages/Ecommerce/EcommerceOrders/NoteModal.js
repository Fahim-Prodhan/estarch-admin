import axios from "axios";
import { useContext, useEffect, useState } from "react";
import baseUrl from "../../../helpers/baseUrl";
import { AuthContext } from "../../../utils/context/AuthProvider";

const NoteModal = ({isOpen,  toggle, orderId }) => {
    const { authUser } = useContext(AuthContext);
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState([]);
    const [adminName, setAdminName] = useState('');
    useEffect(() => {
        if (orderId) {
            const fetchNotes = async () => {
                try {
                    const response = await axios.get(`${baseUrl}/api/orders/orders/notes/${orderId}`);
                    setNotes(response.data.notes || []);
                } catch (error) {
                    console.error('Error fetching notes:', error);
                    setNotes([]); 
                }
            };

            fetchNotes();
        }
    }, [orderId]);

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    const handleSaveNote = async () => {
        if (!orderId) {
          console.error('Order ID is not provided.');
          return;
        }
      
        try {
          if (note.trim()) {
            const adminName = authUser?.fullName;
            const response = await axios.post(`${baseUrl}/api/orders/orders/notes/${orderId}`, { 
              noteContent: note.trim(),
              adminName
            });
      
            setNote('');  
            setNotes(Array.isArray(response.data.order.notes) ? response.data.order.notes : []);
            toggle();
          } else {
            console.error('Note content is empty');
          }
        } catch (error) {
          console.error('Error saving note:', error);
        }
      };
      
    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={toggle}>
            <div className="modal-content bg-white p-6 rounded shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <button className="close-button text-xl font-bold float-right" onClick={toggle}>X</button>

                <h2 className="text-xl font-bold mb-4 text-center">Add a Note</h2>

                <textarea
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    rows="4"
                    placeholder="Enter your note here..."
                    value={note}
                    onChange={handleNoteChange}
                />

                <button className="bg-blue-500 text-white py-2 px-4 rounded w-full" onClick={handleSaveNote}>
                    Save Note
                </button>

                <h3 className="text-lg font-bold mt-6">Previous Notes</h3>
                <ul className="previous-notes-list">
                    {notes.length > 0 ? (
                        notes.map((n) => (
                            <li key={n._id} className="border-b py-2">
                                <p><strong>Admin:</strong> {n.adminName}</p>
                                <p><strong>Note:</strong> {n.noteContent}</p>
                                <p><strong>Date:</strong> {new Date(n.timestamp).toLocaleString()}</p>
                            </li>
                        ))
                    ) : (
                        <li>No notes available</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NoteModal;
