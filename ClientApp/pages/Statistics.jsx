import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import borblogo from '../assets/borblogo.png'
import { getAllTopics, getMessages } from '../api.js'
import styles from './Statistics.module.css'

export default function Statistics() {
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [topicStats, setTopicStats] = useState([])
  const [totalMessages, setTotalMessages] = useState(0)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const allTopics = await getAllTopics()

      const statsWithMessages = await Promise.all(
        allTopics.map(async (topic) => {
          const messages = await getMessages(topic.id)
          return {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            createdAt: topic.createdAt,
            messageCount: messages.length,
            viewCount: topic.viewCount ?? 0,
          }
        })
      )

      const sorted = [...statsWithMessages].sort((a, b) => b.viewCount - a.viewCount)
      const total = statsWithMessages.reduce((sum, t) => sum + t.messageCount, 0)
      const totalViews = statsWithMessages.reduce((sum, t) => sum + t.viewCount, 0)

      setTopics(statsWithMessages)
      setTopicStats(sorted)
      setTotalMessages(total)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      setLoading(false)
    }
  }

  const totalViews = topicStats.reduce((sum, t) => sum + t.viewCount, 0)
  const mostViewed = topicStats[0] || null

  return (
    <div className={styles.page}>
      {/* header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src={borblogo} alt="Borb logo" className={styles.logo} />
          <div>
            <h1 className={styles.brandName}>Borb</h1>
            <p className={styles.tagline}>Statistics & Insights</p>
          </div>
        </div>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
      </header>

      <div className={styles.divider} />

      {loading ? (
        <p className={styles.loading}>Loading stats...</p>
      ) : (
        <div className={styles.content}>
          {/* summary cards */}
          <div className={styles.summaryRow}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon} style={{ background: '#fce4ec' }}>📈</div>
              <div>
                <div className={styles.summaryNumber}>{topics.length}</div>
                <div className={styles.summaryLabel}>Total Topics</div>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon} style={{ background: '#fffde7' }}>👁️</div>
              <div>
                <div className={styles.summaryNumber} style={{ color: '#f59e0b' }}>{totalViews}</div>
                <div className={styles.summaryLabel}>Total Views</div>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon} style={{ background: '#fce4ec' }}>💬</div>
              <div>
                <div className={styles.summaryNumber}>{totalMessages}</div>
                <div className={styles.summaryLabel}>Total Messages</div>
              </div>
            </div>
          </div>

          {/* topic view statistics table */}
          <div className={styles.tableCard}>
            <h2 className={styles.tableTitle}>Topic Access Statistics</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Topic Title</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>View Count</th>
                </tr>
              </thead>
              <tbody>
                {topicStats.map((topic, index) => (
                  <tr key={topic.id} className={index % 2 === 1 ? styles.rowAlt : ''}>
                    <td>
                      <span className={`${styles.rankBadge} ${index < 3 ? styles[`rank${index + 1}`] : styles.rankDefault}`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className={styles.topicTitleCell}>{topic.title}</td>
                    <td className={styles.descCell}>{topic.description}</td>
                    <td className={styles.dateCell}>
                      {topic.createdAt ? new Date(topic.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <span className={styles.accessBadge}>{topic.viewCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* most viewed topic highlight */}
          {mostViewed && (
            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>🏆</div>
              <div className={styles.highlightMeta}>
                <span className={styles.highlightLabel}>MOST VIEWED TOPIC</span>
                <h3 className={styles.highlightTitle}>{mostViewed.title}</h3>
                <p className={styles.highlightDesc}>{mostViewed.description}</p>
              </div>
              <div className={styles.highlightViews}>
                <span className={styles.highlightCount}>{mostViewed.viewCount}</span>
                <span className={styles.highlightViewsLabel}>views</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}