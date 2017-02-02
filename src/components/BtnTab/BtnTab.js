import React from 'react'
import styles from './BtnTab.css'

function BtnTab(props) {

  const { text, active, changeTab, color_type } = props
  let styles_active = active == "active" ? styles.active : null

  let css_color_type = null
  if ( color_type == "2" )
  	css_color_type = styles.color_type2

  return (
  		<div onClick={changeTab} className={styles.btn_tab + " " + styles_active + " " + css_color_type}>
  			{text}
  			<div></div>
  		</div>
  )
}

export default BtnTab