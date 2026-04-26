import { useNavigate } from 'react-router-dom'
import borblogo from '../assets/borblogo.png'
import styles from './BrowseTopics.module.css'
import { useState, useEffect } from 'react'
import { getAllTopics, getUserSubscriptions, subscribe, unsubscribe } from '../api.js'

const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser')
  return user ? JSON.parse(user) : null
}

export default function BrowseTopics() {
  const navigate = useNavigate()
  const [currentUser] = useState(getCurrentUser())
  const [topics, setTopics] = useState([])
  const [subscribedIds, setSubscribedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const allTopics = await getAllTopics()
      setTopics(allTopics)

      if (currentUser) {
        const subs = await getUserSubscriptions(currentUser.id)
        setSubscribedIds(new Set(subs.map(s => s.topicId)))
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSubscribe = async (topicId) => {
    if (!currentUser) {
      navigate('/signin')
      return
    }

    setTogglingId(topicId)
    const isSubscribed = subscribedIds.has(topicId)

    try {
      if (isSubscribed) {
        await unsubscribe(currentUser.id, topicId)
        setSubscribedIds(prev => {
          const next = new Set(prev)
          next.delete(topicId)
          return next
        })
      } else {
        await subscribe(currentUser.id, topicId)
        setSubscribedIds(prev => new Set(prev).add(topicId))
      }
    } catch (error) {
      console.error('Failed to toggle subscription:', error)
    } finally {
      setTogglingId(null)
    }
  }

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.page}>
      {/* header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src={borblogo} alt="Borb logo" className={styles.logo} />
          <div>
            <h1 className={styles.brandName}>Borb</h1>
            <p className={styles.welcome}>Browse all topics</p>
          </div>
        </div>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
      </header>

      <div className={styles.divider} />

      {/* search */}
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="🔍  Search topics..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <span className={styles.resultsCount}>
          {loading ? '...' : `${filteredTopics.length} topic${filteredTopics.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* topic list */}
      <div className={styles.content}>
        {loading ? (
          <p className={styles.status}>Loading topics...</p>
        ) : filteredTopics.length === 0 ? (
          <p className={styles.status}>No topics found.</p>
        ) : (
          <div className={styles.topicList}>
            {filteredTopics.map(topic => {
              const isSubscribed = subscribedIds.has(topic.id)
              const isToggling = togglingId === topic.id

              return (
                <div key={topic.id} className={styles.topicCard}>
                  <div className={styles.topicHeader}>
                    <div className={styles.topicMeta}>
                      <h3 className={styles.topicTitle}>{topic.title}</h3>
                      {isSubscribed && (
                        <span className={styles.subscribedBadge}>✓ Subscribed</span>
                      )}
                    </div>
                    <button
                      className={isSubscribed ? styles.unsubBtn : styles.subBtn}
                      onClick={() => handleToggleSubscribe(topic.id)}
                      disabled={isToggling}
                    >
                      {isToggling
                        ? '...'
                        : isSubscribed
                        ? 'Unsubscribe'
                        : '+ Subscribe'}
                    </button>
                  </div>

                  <div className={styles.topicFooter}>
                    <span className={styles.metaItem}>👁 {topic.viewCount} views</span>
                    <span className={styles.metaItem}>
                      Started by <strong>{topic.createdBy}</strong>
                    </span>
                    <span className={styles.metaItem}>
                      {new Date(topic.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}