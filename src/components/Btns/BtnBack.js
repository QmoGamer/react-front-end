import React, { Component, PropTypes } from 'react'
import styles from './Btns.css'

const constants = require('../../constants')

export default class BtnBack extends Component {

	constructor (props) {
    super(props)
  }

  render () {

    const { color } = this.props

    const img_src = color == 'white' ? constants.ViEW_ICON_BACK : constants.ViEW_ICON_BACK_BLACK
    const css_color = color == 'white' ? styles.white : styles.black

    return (
      <div className={ "btn_back " + css_color } onClick={ ()=> window.history.back() }>
        <img src={ img_src } />
        <div>返回</div>
      </div>
    )
  }
}
