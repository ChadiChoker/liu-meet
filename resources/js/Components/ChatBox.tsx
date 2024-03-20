// Chatbox.js
import React from 'react';

const Chatbox = () => {
    return (
        <div className="flex flex-col h-full bg-white rounded shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Chat</h2>
                <button className="text-gray-600 hover:text-gray-800">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {/* Chat messages will go here */}

        <div className="flex flex-col mb-4">
          <div className="flex items-center">
            <span className="text-gray-600 text-sm">John Doe:</span>
            <p className="bg-gray-200 px-3 py-2 rounded ml-2">Hello!</p>
          </div>
          <span className="text-xs text-gray-400 ml-8">2 minutes ago</span>
        </div>

            </div>
            <div className="flex items-center justify-between p-4 border-t">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="ml-2 text-blue-500 hover:text-blue-600">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbox;
