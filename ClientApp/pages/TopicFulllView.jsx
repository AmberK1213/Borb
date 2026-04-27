import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './TopicFullView.module.css'
import { getTopicById, getMessages, createMessage } from '../api'

export default function TopicPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [topic, setTopic] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const topicData = await getTopicById(id)
      const messages = await getMessages(id)
      const recentMessages = messages.slice(-5).reverse()

      setTopic(topicData)
      setMessages(recentMessages.map(msg => ({
       user: msg.createdBy,
            date: new Date(msg.createdAt).toLocaleString(),
            text: msg.content,
      })))
    } catch (err) {
      console.error(err)
    }
  }

  const handlePost = async () => {
    if (!newMessage.trim()) return

    try {
      await createMessage({
        content: newMessage,
        topicId: id,
        createdBy: currentUser?.username || 'Anonymous',
      })

      setNewMessage('')
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      {/* Topic Header */}
      <div className={styles.topicCard}>
        <div>
          <h2>{topic?.title || 'Topic'}</h2>
          <p className={styles.description}>
            Started by {topic?.createdName || topic?.createdBy || 'Unknown'} on{' '}
            {topic?.createdAt ? new Date(topic.createdAt).toLocaleDateString() : 'an unknown date'}
          </p>
        </div>
        <span className={styles.views}>{topic?.viewCount ?? 0} VIEWS</span>
      </div>

      {/* Post Message */}
      <div className={styles.postCard}>
        <h3>Post a Message</h3>
        <textarea
          placeholder="Share your thoughts..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handlePost}>Post Message</button>
      </div>

      {/* Messages */}
      <h3 className={styles.sectionTitle}>
        All Messages ({messages.length})
      </h3>

      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.messageCard}>
            <div className={styles.avatar}>
              {msg.user?.[0]?.toUpperCase() || 'U'}
            </div>

            <div className={styles.messageContent}>
              <div className={styles.header}>
                <span className={styles.username}>{msg.user}</span>
                <span className={styles.date}>
                  {msg.date}
                </span>
              </div>

              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
