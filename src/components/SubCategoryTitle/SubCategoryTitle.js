import React from 'react'
import styles from './SubCategoryTitle.css'
import { Link } from 'react-router'

function SubcategoryTitle(props) {

  const { name, mainboard_id, id } = props
  // console.log(props);

  return (
    <div className={styles.ArticleListRow}>
    	<Link to={"/theme/"+mainboard_id+"/"+id}>
				{name}
			</Link>
    </div>
  )
}

export default SubcategoryTitle