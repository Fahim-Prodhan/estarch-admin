// src/components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, title, children, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                {children}
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                        Cancel
                    </button>
                    <button onClick={onSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
