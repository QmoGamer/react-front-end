import React, { Component } from 'react'
import styles from './ThemeArticleList.css'
import ThemeArticleRow from '../ThemeArticleRow/ThemeArticleRow'
import { yyyymmdd } from '../../../utils'
const constants = require('../../../constants')

export default class ThemeArticleList extends Component {

	constructor (props) {
    super(props)
  }

  renderRow () {

    const { data, member } = this.props

    return data.map((x, y) => {

      if ( x.content.length == 0 ) {

        return <div key={ "row_" + y } className="rows_type1">{ constants.VIEW_TEXT_MY_POST_1 }</div>
      }
      else {

        let row_data = {
          article_id: x.article_id,
          article_content_id: x.content[0].article_content_id,
          // cover: x.content[0].photo_path == null ? constants.DEFAULT_COVER : constants.API_HOST + x.content[0].photo_path,
          title: x.title,
          // theme_id: 'x.mainboard_id',
          // theme_name: 'x.mainboard_name',
          // sub_theme_id: x.subboard_id,
          // sub_theme_name: x.subboard_name,
          likes: x.content[0].like_count,
          is_like: x.content[0].liked,
          replys: x.response_count,
          post_date: yyyymmdd(x.post_time),
          reply_date: yyyymmdd(x.edit_time),
          is_collect: x.collected,
          user_id: x.user_id,
          nickname: x.content[0].nickname
        }

        return <ThemeArticleRow key={ "row_" + y } data={ row_data } member={ member } />
      }
    })
  }

  render () {
  	// console.log( this.props )

		return (
			<div className={ styles.table }>
      	<div className={ styles.header }>
      		<div className="rows_type1">
            <div className={ styles.title }>標題</div> 
            <div className={ styles.likes }>讚</div>
            <div className={ styles.replys }>回文</div>
            <div className={ styles.author }>作者</div>
            <div className={ styles.action }></div>
          </div>
      	</div>
      	<div className={ styles.body }>
      		{ this.renderRow() }
      	</div>
			</div>
		)
  }
}
