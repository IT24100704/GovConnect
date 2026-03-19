'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './communication-hub.module.css';

interface ChatMessage {
  id: string;
  sender: 'citizen' | 'officer' | 'system';
  senderName: string;
  senderRole: string;
  avatar?: string;
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
}

interface ChatThread {
  id: string;
  complaintId: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  timestamp: string;
  status: 'active' | 'pending' | 'resolved';
  unreadCount: number;
}

export default function CommunicationHubPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'active' | 'pending' | 'resolved' | 'all'>('active');

  useEffect(() => {
    // Mock chat threads
    const mockThreads: ChatThread[] = [
      {
        id: '1',
        complaintId: '#GRV-8821-2024',
        participantName: 'John Doe',
        participantRole: 'Active now • Citizen Complainant',
        lastMessage: 'Complaint #8821. Is been 5 days and haven received any update regarding...',
        timestamp: '10:45 AM',
        status: 'active',
        unreadCount: 0,
      },
      {
        id: '2',
        complaintId: '#GRV-8754-2024',
        participantName: 'Sarah Smith',
        participantRole: 'Pending • Citizen Complainant',
        lastMessage: 'Repair street electricity billing issue',
        timestamp: '08:52 AM',
        status: 'pending',
        unreadCount: 0,
      },
      {
        id: '3',
        complaintId: '#GRV-8650-2024',
        participantName: 'Robert Wilson',
        participantRole: 'Resolved • Citizen Complainant',
        lastMessage: 'Pothole repair request',
        timestamp: 'Yesterday',
        status: 'resolved',
        unreadCount: 0,
      },
    ];

    setThreads(mockThreads);
    setSelectedThread(mockThreads[0]);

    // Load messages for first thread
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        sender: 'citizen',
        senderName: 'John Doe',
        senderRole: 'Citizen',
        message:
          "Hello, I'm checking on the status of my complaint #8821. It's been 5 days and I haven't received any update regarding the document",
        timestamp: '10:45 AM',
        type: 'text',
      },
      {
        id: '2',
        sender: 'officer',
        senderName: 'Hello Mr. Doe; I am the assigned officer for your case. We are currently verifying the forms and need clarity. It seems a bit blurry.',
        senderRole: 'Officer',
        message:
          'Hello Mr. Doe; I am the assigned officer for your case. We are currently verifying the forms and need clarity.',
        timestamp: '10:30 AM',
        type: 'text',
      },
      {
        id: '3',
        sender: 'citizen',
        senderName: 'John Doe',
        senderRole: 'Citizen',
        message: 'Oh, I apologize. Let me upload a clearer version of the 2023 receipt right now',
        timestamp: '10:48 AM',
        type: 'text',
      },
      {
        id: '4',
        sender: 'citizen',
        senderName: 'John Doe',
        senderRole: 'Citizen',
        message: 'Property_Tax_2023_Clear.pdf',
        timestamp: '10:48 AM',
        type: 'file',
        fileUrl: '#',
        fileName: 'Property_Tax_2023_Clear.pdf',
      },
    ];

    setMessages(mockMessages);
  }, []);

  const filteredThreads = threads.filter((t) => (filterStatus === 'all' ? true : t.status === filterStatus));

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedThread) {
      const newMsg: ChatMessage = {
        id: String(messages.length + 1),
        sender: 'officer',
        senderName: 'Officer Name',
        senderRole: 'Officer',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };

      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={handleGoBack}>← Back</button>
          <div>
            <h1>Communication Hub</h1>
            <p>Manage active grievances and communicate directly with citizens</p>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Sidebar - Thread List */}
        <div className={styles.threadList}>
          <div className={styles.threadHeader}>
            <h2>Communication Threads</h2>
          </div>

          <div className={styles.filterTabs}>
            {(['active', 'pending', 'resolved', 'all'] as const).map((status) => (
              <button
                key={status}
                className={`${styles.filterTab} ${filterStatus === status ? styles.active : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.threadItems}>
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className={`${styles.threadItem} ${selectedThread?.id === thread.id ? styles.selected : ''}`}
                onClick={() => setSelectedThread(thread)}
              >
                <div className={styles.threadInfo}>
                  <div className={styles.threadStatus}>
                    <span className={`${styles.statusDot} ${styles[thread.status]}`}>●</span>
                    <span className={styles.participantName}>{thread.participantName}</span>
                  </div>
                  <p className={styles.participantRole}>{thread.participantRole}</p>
                  <p className={styles.lastMessage}>{thread.lastMessage}</p>
                </div>
                <div className={styles.threadMeta}>
                  <span className={styles.timestamp}>{thread.timestamp}</span>
                  {thread.unreadCount > 0 && (
                    <span className={styles.unreadBadge}>{thread.unreadCount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Chat Window */}
        {selectedThread && (
          <div className={styles.chatWindow}>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
              <div className={styles.participantInfo}>
                <div className={styles.avatar}>JD</div>
                <div>
                  <h3>{selectedThread.participantName}</h3>
                  <p>{selectedThread.participantRole}</p>
                </div>
              </div>
              <div className={styles.chatActions}>
                <button>📞</button>
                <button>💬</button>
                <button>⋮</button>
              </div>
            </div>

            {/* Messages Container */}
            <div className={styles.messagesContainer}>
              {messages.map((msg) => (
                <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                  {msg.sender === 'citizen' && <div className={styles.msgAvatar}>R</div>}
                  <div className={styles.msgContent}>
                    <div className={styles.msgMeta}>
                      <span className={styles.msgSender}>{msg.senderName}</span>
                      <span className={styles.msgTime}>{msg.timestamp}</span>
                    </div>
                    {msg.type === 'text' && <p className={styles.msgText}>{msg.message}</p>}
                    {msg.type === 'file' && (
                      <div className={styles.msgFile}>
                        <span className={styles.fileIcon}>📄</span>
                        <span className={styles.fileName}>{msg.fileName}</span>
                        <a href={msg.fileUrl} className={styles.downloadBtn}>
                          ↓
                        </a>
                      </div>
                    )}
                  </div>
                  {msg.sender === 'officer' && <div className={styles.msgAvatar}>O</div>}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className={styles.messageInput}>
              <div className={styles.inputActions}>
                <button className={styles.actionBtn} title="Attach file">
                  📎
                </button>
                <button className={styles.actionBtn} title="Emoji">
                  😊
                </button>
              </div>
              <textarea
                className={styles.inputField}
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button className={styles.sendBtn} onClick={handleSendMessage}>
                ➤
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
