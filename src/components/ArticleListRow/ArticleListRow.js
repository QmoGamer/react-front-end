import React from 'react'
import styles from './ArticleListRow.css'
import { Link } from 'react-router'

function ArticleListRow(props) {
	// console.log(props);
  const { title, content, article_path, news_id } = props

  return (
    <div className={styles.ArticleListRow}>
    	<Link to={article_path + '/' +news_id}>
	    	<div className={styles.title}>{title}</div>
	    	<div className={styles.content + " ellipsis"}>{content}</div>
	    </Link>
    </div>
  )
}

export default ArticleListRow