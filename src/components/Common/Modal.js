import React from 'react';

const Modal = ({ isOpen, onClose, title, children, onSave, showSave = true, showCancel = true }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white h-[600px] max-h-[80vh] w-1/2 rounded-lg shadow-lg overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 px-12 py-4 border-b">
                    <h2 className="text-2xl font-bold">{title}</h2>
                </div>
                <div className="p-12">
                    {children}
                </div>
                <div className="sticky bottom-0 bg-white z-10 px-12 py-4 border-t flex justify-end">
                    {showCancel && (
                        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                            Cancel
                        </button>
                    )}
                    {showSave && (
                        <button onClick={onSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
