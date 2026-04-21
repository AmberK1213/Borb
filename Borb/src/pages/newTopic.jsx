import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import borblogo from '../assets/borblogo.png'
import styles from './newTopic.module.css'

export default function StartNewTopic() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className={styles.page}>
      {/* header */}
      <header className={styles.header}>
        <img src={borblogo} alt="Borb logo" className={styles.logo} />
        <h1 className={styles.brandName}>Start New Topic</h1>
      </header>

      <div className={styles.divider} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Create a New Topic</h2>

          <div className={styles.field}>
            <label className={styles.label}>
              Topic Title <span className={styles.req}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter a catchy title for your topic"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Description <span className={styles.req}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Describe what this topic is about..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={() => navigate('/')}>
              Cancel
            </button>
            <button className={styles.createBtn}>
              Create Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}