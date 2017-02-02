import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'

import styles from './Home.css'
import { isEmpty } from '../../../utils'
const constants = require('../../../constants')

export default class Announcement extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    console.log( this.props )
    const { data } = this.props

    // let render_img = isEmpty( isEmpty ) ? '/public/img/news_temp.jpg' : photo_path

    return (
      <div className={ styles.announcement }>
        {
          data.map((x, y)=>{

            if( y < 5 ) {
              return (
                <a key={y} className={ styles.row } href={ "/news_detail/" + x.news_id }>
                  <div className={ styles.title }>{ x.title }</div>
                  <div className={ styles.content }>{ ReactHtmlParser( x.content ) }</div>
                </a>
              )
            }
          })
        }
        <a href="/news_list/1" className={ styles.more }>檢視全部</a>
      </div>
    )
  }
}