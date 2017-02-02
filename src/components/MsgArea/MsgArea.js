import React from 'react'
import styles from './MsgArea.css'

function MsgArea(props) {

  const { pro_pic, name, msg_time, content } = props

  return (
  		<div className={styles.msg_area + " flex"}>
        <div><img src={pro_pic} /></div>
        <div className={styles.msg_info} style={{"flex": "1"}}>
          <div className="flex flex_jc_sb">
            <div className={styles.msger}>{name}</div>
            <div className={styles.msg_date}>{msg_time}</div>
          </div>
          <div className={styles.msg_content}>{content}</div>
        </div>
      </div>
  )
}

export default MsgArea