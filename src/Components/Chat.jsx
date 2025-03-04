import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../AxiosClient';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Spinner } from 'flowbite-react';

window.Pusher = Pusher;
Pusher.logToConsole = true

const Chat = ({ appointmentId, doctor_id, user_id, from }) => {
    const messagesEndRef = useRef(null);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading , setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [isMessagesLoading , setIsMessagesLoading] = useState(false);

    useEffect(() => {
      setIsMessagesLoading(true)
        axiosClient.get('chat/conversations')
            .then((response) => {
                const conversations = response.data.conversations;

                const matchedConversation = conversations.find(
                    convo => convo.appointment_id === appointmentId
                );

                if (matchedConversation) {
                    setConversationId(matchedConversation.chats[0].conversation_id);
                    setMessages(matchedConversation.chats);
                    fetchMessages(matchedConversation.chats[0].conversation_id);
                } else {
                    console.log('NO conversations found');
                }
            })
            .catch(error => console.error('Error fetching conversations:', error))
            .finally(() => setIsMessagesLoading(false));
    }, [appointmentId]);

    const fetchMessages = (convId) => {
        axiosClient.get(`chat/conversation/${convId}`)
            .then(response => setMessages(response.data.chats))
            .catch(error => console.error('Error fetching messages:', error));
    };

    const sendMessage = () => {
        if (!message.trim() && !file) return;
        setLoading(true)

        const formData = new FormData();
        formData.append('appointment_id', appointmentId);
        formData.append('message', message);
        if (file) {
            formData.append('file', file);
        }

        axiosClient.post('chat/send', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
            setMessages([...messages, response.data.chat]);
            setMessage('');
            setFile(null);
            if (!conversationId) {
                setConversationId(response.data.conversation_id);
            }
        })
        .catch(error => console.error('Error sending message:', error))
        .finally(() => setLoading(false))
    };

    useEffect(() => {
        
        if (!doctor_id || !user_id) return;

        const echo = new Echo({
            broadcaster: "pusher",
            key: "12aa46427c67f00419ae",
            cluster: "mt1",
            forceTLS: true,
            encrypted: false,
        });

        console.log("Pusher connection state: ", echo.connector.pusher.connection.state);


        const channel = echo.private(`chat.${doctor_id}.${user_id}`);

        channel.listen(".MessageSent", (newMessage) => {
            console.log("New message received:", newMessage);
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            channel.stopListening(".MessageSent");
            channel.unsubscribe();
        };
    }, [doctor_id, user_id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileOpen = async (fileId) => {
    try {
        const response = await axiosClient.get(`chat/download/${fileId}`, {
          responseType: 'blob',  // Ensures response is treated as a file
        });

        // Create a Blob URL
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);

        // Open in a new tab
        window.open(url, '_blank');

        // Optional: Revoke URL after use to free memory
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);

    } catch (error) {
        console.error("Error downloading file:", error);
    }
  };



return (
    <div className="border rounded-lg shadow-md w-full h-[50%] bg-white">
      <div className="h-[35rem] overflow-y-auto p-2 border-b px-4">
      {isMessagesLoading && <div className="flex items-center justify-center h-[35rem]"><Spinner size="lg" variant="primary" /></div>}
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-2 flex gap-1 items-start ${msg.sender_type.includes("User") ? "justify-start" : "justify-end"}`} >
            {msg.sender_type.includes("User")
            ?
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-blue-800">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
            :
              <img 
                src="https://w7.pngwing.com/pngs/661/543/png-transparent-stethoscope-cartoon-stethoscope-medical-medical-equipment-thumbnail.png" 
                alt="doctor"
                className="w-6 h-6 rounded-full object-cover order-2"
               />
            }
            <div className={`inline-block p-2 rounded-lg ${!msg.sender_type.includes("User") ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              {msg.message}
              {(msg.file_path) && (
                <div>
                  <button 
                    type="button"
                    target="_blank" rel="noopener noreferrer" 
                    className={`flex gap-2 ${msg.sender_type.includes("User") ? "text-gray-500" : "text-blue-100"} brightness-90 hover:underline hover:brightness-110 transition-all ease-in-out duration-150`}
                    onClick={e => handleFileOpen(msg.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                    </svg>
                    View File
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg disabled:opacity-40"
          disabled={loading}
        />
        <input 
          type="file" 
          accept={from === 'user' ? 'image/*' : ''}
          // ref={fileInputRef}
          multiple={false} 
          onChange={(e) => setFile(e.target.files[0])} 
          className="disabled:opacity-40 border rounded-lg p-1" 
          disabled={loading} 
        />
        <button 
          disabled={loading} 
          onClick={sendMessage}
          type='button'
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-40"
        >
          {loading 
            ? <Spinner />
            : "Send"          
          }          
        </button>
      </form>
    </div>
  );
};

export default Chat;
