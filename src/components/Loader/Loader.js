import React from 'react'
import styles from './Loader.css'
const constants = require('../../constants');

function Loader() {
  return (
  	<div className={styles.loader}>
      <img src={ constants.VIEW_LOADING_GIF } />
      {
        // <span className={styles.block}></span>
        // <span className={styles.block}></span>
        // <span className={styles.block}></span>
        // <span className={styles.block}></span>
        // <span className={styles.block}></span>
        // <span className={styles.block}></span>
        // <span className={styles.block}></span>
        // <span className={styles.block}></span>
        // <span className={styles.block}></span>
      }
    </div>
  )
}

export default Loader