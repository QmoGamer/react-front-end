import React from 'react'
import styles from './Footer.css'

function Footer() {
  return (
    <div className={styles.footer}>
      <div className="flex">
        <a className={styles.social_icon}><i className="fa fa-youtube-square fa-2x"></i></a>
        <a className={styles.social_icon}><i className="fa fa-facebook-square fa-2x"></i></a>
        <a className={styles.social_icon}><i className="fa fa-twitter-square fa-2x"></i></a>
      </div>
      <div className={styles.copyright}>Copyright</div>
    </div>
  )
}

export default Footer