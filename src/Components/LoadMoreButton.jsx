// src/components/LoadMoreButton.js
import React from 'react';

const LoadMoreButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick} // Call the passed in onClick function
            className="bg-blue-500 text-white font-medium py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            style={{
                position: 'relative',
                left: '50%',
                width: '250px',
                borderRadius: '9px',
                transform: 'translateX(-50%)', // Center the button horizontally
            }}
        >
            Load More
        </button>
    );
};

export default LoadMoreButton;
