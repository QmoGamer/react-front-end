import React from 'react'
import styles from './TextAboveImg.css'
const constants = require('../../constants')
import { Link } from 'react-router'

function TextAboveImg(props) {
	// console.log(props);
  const { title, path, rows, article_path, news_id } = props

  return (
    <div className={styles.text_above_img}>
    	{
	    //  <img src={constants.API_HOST+path} />
	    }
      <Link to={article_path + '/' + news_id}>
  	    <img src="/public/img/news_temp.jpg" width="600px" height="450" />
        <div className={styles.above_text_bg}><div className={styles.above_text + " ellipsis"} style={{"WebkitLineClamp": rows}}>{title}</div></div>
      </Link>
    </div>
  )
}

export default TextAboveImg