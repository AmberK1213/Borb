import { useNavigate } from 'react-router-dom'
import borblogo from '../assets/borblogo.png'
import styles from './Dashboard.module.css'

// TODO: replace with real auth state
const currentUser = null

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
  return name.charAt(0).toUpperCase()
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      {/* header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src={borblogo} alt="Borb logo" className={styles.logo} />
          <div>
            <h1 className={styles.brandName}>Borb</h1>
            {currentUser
              ? <p className={styles.welcome}>Welcome back, {currentUser}!</p>
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
              <button className={styles.logoutBtn}>
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

      {/* subscribed topics */}
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>My Subscribed Topics</h2>

        <div className={styles.topicList}>
          {SUBSCRIBED_TOPICS.map(topic => (
            <div key={topic.id} className={styles.topicCard}>
              <div className={styles.topicHeader}>
                <div className={styles.topicMeta}>
                  <h3 className={styles.topicTitle}>{topic.title}</h3>
                  <span className={styles.recentBadge}>
                    {topic.recentCount} RECENT MESSAGE{topic.recentCount !== 1 ? 'S' : ''}
                  </span>
                </div>
                <button className={styles.unsubBtn}>Unsubscribe</button>
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

              <button className={styles.viewTopicBtn}>
                View Full Topic & Post Message
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}