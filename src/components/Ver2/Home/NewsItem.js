import React, { Component } from 'react'

import styles from './Home.css'
import { isEmpty, checkImg } from '../../../utils'
const constants = require('../../../constants')

export default class NewsItem extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    // console.log( this.props )
    const { news_id, photo_path, title } = this.props
    // console.log( isEmpty( photo_path ) )
    let render_img = checkImg( photo_path )

    return (
      <div className={ styles.news_item }>
        <a href={ "/news_detail/" + news_id }>
          <img src={ render_img } />
        </a>
        <div className={ styles.mask }>
          <div className={ styles.title }>{ title }</div>
        </div>
      </div>
    )
  }
}