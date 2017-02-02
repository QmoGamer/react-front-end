import React, { Component } from 'react'
import Slider from 'react-slick'

import NewsItem from './NewsItem'

import styles from './Home.css'
const constants = require('../../../constants')

export default class News extends Component {

	constructor (props) {
    super(props)
  }

  render () {
  	// console.log( this.props )
    const { data } = this.props
    const settings = { dots: true, speed: 500, autoplay: true, autoplaySpeed: 100000 };

		return (
			<div className={ styles.news }>
      	<Slider {...settings}>
          {
            data.map((x, y)=> <div key={y}><NewsItem {...x} /></div> )
          }
        </Slider>
			</div>
		)
  }
}
