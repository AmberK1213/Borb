import { useNavigate } from 'react-router-dom'
import borblogo from '../assets/borblogo.png'
import styles from './Dashboard.module.css'
import { useState, useEffect } from 'react'
import * as signalR from '@microsoft/signalr'
import {
  SIGNALR_BASE,
  getUserSubscriptions,
  getMessages,
  unsubscribe,
  getTopicById,
  getNotifications,
} from '../api.js'

// TODO: replace with real auth state
const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser')
  return user ? JSON.parse(user) : null
}

const SUBSCRIBED_TOPICS = [
  {
    id: 1,
    title: 'Welcome to Borb',
    description: 'General discussion about Borb',
    recentCount: 2,
    messages: [
      { user: 'charlie', date: '4/16/2026, 8:00:00 AM', text: 'Loving the pink and yellow theme!' },
      { user: 'bob', date: '4/15/2026, 11:30:00 AM', text: 'Thanks Alice! This is a great platform.' },
    ],
  },
  {
    id: 2,
    title: 'Announcements',
    description: 'Official Borb announcements and updates',
    recentCount: 1,
    messages: [
      { user: 'alice', date: '4/17/2026, 9:00:00 AM', text: 'New features coming soon — stay tuned! 🐣' },
    ],
  },
]

function getInitial(name) {
  return name?.charAt(0).toUpperCase() || 'U'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [subscribedTopics, setSubscribedTopics] = useState([])
  const [notifications, setNotifications] = useState([])
  const [liveNotice, setLiveNotice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      fetchSubscribedTopics()
      fetchNotifications()
    } else {
      setLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return

    let isDisposed = false
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${SIGNALR_BASE}/hubs/notifications?userId=${encodeURIComponent(currentUser.id)}`)
      .withAutomaticReconnect()
      .build()

    connection.on('NotificationReceived', (notification) => {
      setNotifications(prev => {
        if (prev.some(item => item.id === notification.id)) return prev
        return [notification, ...prev].slice(0, 10)
      })
      setLiveNotice(notification)
      fetchSubscribedTopics()
    })

    connection.start().catch(error => {
      if (!isDisposed) {
        console.error('Failed to connect to notifications:', error)
      }
    })

    return () => {
      isDisposed = true
      connection.off('NotificationReceived')

      if (connection.state !== signalR.HubConnectionState.Disconnected) {
        connection.stop().catch(error => {
          console.error('Failed to disconnect from notifications:', error)
        })
      }
    }
  }, [currentUser])

  const fetchSubscribedTopics = async () => {
    try {
        const subs = await getUserSubscriptions(currentUser.id)

        const topicsWithMessages = await Promise.all(
        subs.map(async (sub) => {
        const topic = await getTopicById(sub.topicId)
        const messages = await getMessages(sub.topicId)
        const recentMessages = messages.slice(-5).reverse()

        return {
          id: sub.topicId,
          title: topic?.title || 'Unknown Topic',
          description: topic?.description || '',
          recentCount: recentMessages.length,
          messages: recentMessages.map(msg => ({
            user: msg.createdBy,
            date: new Date(msg.createdAt).toLocaleString(),
            text: msg.content,
          
          }))
    }
  })
)
      setSubscribedTopics(topicsWithMessages)
    } catch (error) {
      console.error('Failed to fetch subscribed topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const result = await getNotifications(currentUser.id)
      setNotifications(result.slice(-10).reverse())
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    setSubscribedTopics([])
    setNotifications([])
    setLiveNotice(null)
  }

  const handleUnsubscribe = async (topicId) => {
    if (!currentUser) return
    try {
      await unsubscribe(currentUser.id, topicId)
      setSubscribedTopics(prev => prev.filter(t => t.id !== topicId))
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
    }
  }

  return (
    <div className={styles.page}>
      {/* header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src={borblogo} alt="Borb logo" className={styles.logo} />
          <div>
            <h1 className={styles.brandName}>Borb</h1>
            {currentUser
              ? <p className={styles.welcome}>Welcome back, {currentUser.username}!</p>
              : <p className={styles.welcome}>Your message exchange community</p>
            }
          </div>
        </div>
        <div className={styles.headerRight}>
          {currentUser ? (
            <>
              <button className={styles.statsBtn} onClick={() => navigate('/statistics')}>
                📈 Statistics
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                ↪ Logout
              </button>
            </>
          ) : (
            <button className={styles.statsBtn} onClick={() => navigate('/signin')}>
              Sign In
            </button>
          )}
        </div>
      </header>

      <div className={styles.divider} />

      {/* action buttons */}
      <div className={styles.actions}>
        <button className={styles.newTopicBtn} onClick={() => navigate('/newTopic')}>
          + Start New Topic
        </button>
        <button className={styles.browseBtn} onClick={() => navigate('/browse')}>
          💬 Browse Topics
        </button>
      </div>

      {currentUser && (
        <section className={styles.notifications}>
          <div className={styles.notificationHeader}>
            <h2 className={styles.notificationTitle}>Notifications</h2>
            <span className={styles.notificationCount}>{notifications.length}</span>
          </div>

          {liveNotice && (
            <div className={styles.liveNotice}>
              New message in a subscribed topic: {liveNotice.message}
            </div>
          )}

          {notifications.length === 0 ? (
            <p className={styles.emptyNotifications}>No notifications yet.</p>
          ) : (
            <div className={styles.notificationList}>
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={styles.notificationItem}
                  onClick={() => navigate(`/topic/${notification.topicId}`)}
                >
                  <span className={styles.notificationMessage}>{notification.message}</span>
                  <span className={styles.notificationDate}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* subscribed topics */}
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>My Subscribed Topics</h2>

        {loading ? (
          <p>Loading...</p>
        ) : subscribedTopics.length === 0 ? (
          <p>No subscribed topics yet. Browse and subscribe to topics!</p>
        ) : (
          <div className={styles.topicList}>
            {subscribedTopics.map(topic => (
              <div key={topic.id} className={styles.topicCard}>
                <div className={styles.topicHeader}>
                  <div className={styles.topicMeta}>
                    <h3 className={styles.topicTitle}>{topic.title}</h3>
                    <span className={styles.recentBadge}>
                      {topic.recentCount} RECENT MESSAGE{topic.recentCount !== 1 ? 'S' : ''}
                    </span>
                  </div>
                  <button className={styles.unsubBtn} onClick={() => handleUnsubscribe(topic.id)}>Unsubscribe</button>
                </div>

                <p className={styles.topicDesc}>{topic.description}</p>
                <p className={styles.recentLabel}>{topic.recentCount} Most Recent Messages:</p>

                <div className={styles.messageList}>
                  {topic.messages.map((msg, i) => (
                    <div key={i} className={styles.messageCard}>
                      <div className={styles.msgAvatar}>{getInitial(msg.user)}</div>
                      <div className={styles.msgContent}>
                        <span className={styles.msgUser}>{msg.user}</span>
                        <span className={styles.msgDate}>{msg.date}</span>
                        <p className={styles.msgText}>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className={styles.viewTopicBtn} onClick={() => navigate(`/topic/${topic.id}`)}>
                  View Full Topic & Post Message
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
