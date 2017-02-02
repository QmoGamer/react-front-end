import React, { Component, PropTypes } from 'react'

import styles from './SearchItem.css'

import { isEmpty } from '../../../utils'
const constants = require('../../../constants')

export default class SearchItem extends Component {

	constructor (props) {
    super(props)
    this.searchArticle = this.searchArticle.bind(this)
    this._handleKeyPress = this._handleKeyPress.bind(this)
    // this.state = { is_like: props.is_like, is_collect: props.is_collect, enable: 1, likes: props.likes }
  }

  searchArticle () {

    let keyword = this.refs.keyword.value

    if( !isEmpty(keyword) ) 
      window.location.href = '/search/' + keyword + "/1"
  }

  _handleKeyPress (e) {

    if (e.key === 'Enter') {
      this.searchArticle()
    }
  }

  render () {
  	// console.log( this.props )
    const { css_type } = this.props

    const styles_type = css_type == 'desktop' ? styles.desktop_search : styles.mobile_search

		return (
			<div className={ styles.search + " " + styles_type }>
        <input className={ styles.input_search } onKeyPress={ this._handleKeyPress } ref="keyword" type="search" placeholder="搜尋" />
        <div className={ styles.btn_search } onClick={ this.searchArticle }><i className="fa fa-search"></i></div>
      </div>
		)
  }
}
