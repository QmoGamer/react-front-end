import React, { Component, PropTypes } from 'react'

import styles from './ThemeList.css'

const constants = require('../../../constants')

export default class ThemeList extends Component {

  constructor (props) {
    super(props)
  }

  renderRow ( data, y ) {
    
    return <a href={ "/theme/" + data.id } key={ y }>{ data.name }</a>
  }

  render () {
    // console.log( this.props )
    const { theme } = this.props

    let render_row = theme.map((x, y)=> this.renderRow(x, y) )

    return (
      <div className={ styles.theme_list }>
        { render_row }
      </div>
    )
  }
}
