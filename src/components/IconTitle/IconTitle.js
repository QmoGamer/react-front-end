import React from 'react'
import styles from './IconTitle.css'

function IconTitle(props) {

	const { title, color } = props

	return (
		<div className={ styles.icon_title } style={{ color: color }}>
			<div style={{ backgroundColor: color }}></div>
			<div>{ title }</div>
		</div>
	)

  // const { icon_classname, title, color } = props

  // return (
  // 		<div style={{"color": color}}>
  //   		<i className={icon_classname}></i>{title}
  //   	</div>
  // )
}

export default IconTitle