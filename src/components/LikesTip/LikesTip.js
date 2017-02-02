import React from 'react'
import styles from './LikesTip.css'

function LikesTip(props) {

  const { likes, msgs } = props

  return (
  		<div className={styles.likes_tip}>
        <div style={{"marginRight": "0.5rem"}}>{likes}個讚</div><div>{msgs}則留言</div>
      </div>
  )
}

export default LikesTip