import React from 'react'
import styles from './Ad.css'

function Ad(props) {

  const { path, width } = props

  return (
    <div className={styles.Ad}>
      <img src={path} width={width} />
    </div>
  )
}

export default Ad