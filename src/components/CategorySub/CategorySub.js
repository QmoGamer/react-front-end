import React from 'react'
import styles from './CategorySub.css'
import { Link } from 'react-router'

function CategorySub(props) {

  const { id, img, name, theme_id } = props

  return (
  		<div className={styles.category_sub}>
  			<Link to={"/theme/"+theme_id+"/"+id} className="flex flex_ai_c">
	  			<div><img src={img} /></div>
	  			<div className={styles.category_sub_name}>{name}</div>
	  		</Link>
  		</div>
  )
}

export default CategorySub
