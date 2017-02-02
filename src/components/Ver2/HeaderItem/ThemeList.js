import React, { Component, PropTypes } from 'react'

import IconTitle from '../../IconTitle/IconTitle'
import styles from './ThemeList.css'

// import { isEmpty } from '../../../utils'
const constants = require('../../../constants')

export default class ThemeList extends Component {

	constructor (props) {
    super(props)
  }

  renderHomeLink ( css_type, path ) {

    if ( css_type == 'desktop' ) {
      return ''
    }
    else if ( css_type == 'mobile' ) {

      let css_active = path == '/' ? "#e5352b" : '#4b4b4b'

      return <a href="/"><IconTitle title="首頁" color={ css_active } /></a>
    }
  }

  renderRow ( data, y, path ) {
    // console.log(data, path)
    let path_id = path.split('/') 
    let css_active = ( path_id[1] = 'theme' && data.id == path_id[2] ) ? styles.active : ''

    return <a href={ "/theme/" + data.id } className={ css_active } key={ y }>{ data.name }</a>
  }

  renderMobileRow ( data, y, path ) {

    let path_id = path.split('/') 
    let css_active = data.id == path_id[2] ? "#e5352b" : '#4b4b4b'

    return <a href={ "/theme/" + data.id } key={ y }><IconTitle title={ data.name } color={ css_active } /></a>
  }

  render () {
  	// console.log( this.props )
    const { css_type, theme, path } = this.props

    let styles_type = css_type == 'desktop' ? styles.theme_list : styles.burger_menu_body
    let render_home_link = this.renderHomeLink( css_type, path )
    let render_theme_list = css_type == 'desktop' ? theme.map((x, y)=> this.renderRow(x, y, path)) : theme.map((x, y)=> this.renderMobileRow(x, y, path))

		return (
			<div className={ styles_type }>
        { render_home_link }
        { render_theme_list }
      </div>
		)
  }
}
