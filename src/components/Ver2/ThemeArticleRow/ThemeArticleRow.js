import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './ThemeArticleRow.css'
import { ver2_apiLikeArticle, ver2_apiDislikeArticle, ver2_apiCollectArticle, ver2_apiDeleteCollectArticle } from '../../../actions/article'

class ThemeArticleRow extends Component {

	constructor (props) {
    super(props)
    this.state = { 
      is_enable: true,
      likes: props.data.likes,
      is_like: props.data.is_like, 
      is_collect: props.data.is_collect 
    }
    this.onLike = this.onLike.bind(this)
    this.onCollect = this.onCollect.bind(this)
  }

  toggleEdit ( bool ) {

    if( bool == true ) {

      this.refs['edit'].style.display = "block"
      this.refs['mask'].style.display = "block"
      this.refs['edit_img'].style.backgroundColor = "red"
      this.refs['edit_img'].className = "active rows_edit_img " + styles.action
    }
    else {

      this.refs['edit'].style.display = "none"
      this.refs['mask'].style.display = "none"
      this.refs['edit_img'].style.backgroundColor = "#eee"
      this.refs['edit_img'].className = "rows_edit_img " + styles.action
    }
  }

  onLike () {

    const { data, member } = this.props
    const { is_enable, likes, is_like } = this.state

    if ( is_enable == true ) {

      if( member.member_status == 2 ) {

        let member_cookie = member.member_info.member_cookie
        let auth_token = member.member_info.token
        let article_content_id = data.article_content_id

        if( is_like == 1 ) {
          this.props.dispatch( ver2_apiDislikeArticle( location.origin, member_cookie, auth_token, article_content_id ) )
            .then( res => {

              res.data.status == 1 ? this.setState({ is_like: 0, is_enable: false, likes: (likes - 1) }) : alert( res.data.error.error_msg )
            })
        }
        else {
          this.props.dispatch( ver2_apiLikeArticle( location.origin, member_cookie, auth_token, article_content_id ) )
            .then( res => {

              res.data.status == 1 ? this.setState({ is_like: 1, is_enable: false, likes: (likes + 1) }) : alert( res.data.error.error_msg )
            })
        }
        setTimeout( function(){ this.setState({ is_enable: true }) }.bind(this), 2000 )
      }
      else{
        alert("請先登入會員")
        window.location.href = '/member_login'
      }
    }
  }

  onCollect () {

    const { data, member } = this.props
    const { is_enable, is_collect } = this.state

    if ( is_enable == true ) {

      if( member.member_status == 2 ) {

        let member_cookie = member.member_info.member_cookie
        let auth_token = member.member_info.token
        let article_id = data.article_id

        if( is_collect == 1 ) {
          this.props.dispatch( ver2_apiDeleteCollectArticle( location.origin, member_cookie, auth_token, article_id ) )
            .then( res => res.data.status == 1 ? this.setState({ is_collect: 0, is_enable: false }) : alert( res.data.error.error_msg ))
        }
        else {
          this.props.dispatch( ver2_apiCollectArticle( location.origin, member_cookie, auth_token, article_id ) )
            .then( res => res.data.status == 1 ? this.setState({ is_collect: 1, is_enable: false }) : alert( res.data.error.error_msg ))
        }
        setTimeout( function(){ this.setState({ is_enable: true }) }.bind(this), 2000 )
      }
      else {
        alert("請先登入會員")
        window.location.href = '/member_login'
      }
    }
  }

  renderAction1 () {

    const { data } = this.props
    const { is_like, is_collect } = this.state
    let css_btn_like = is_like == 1 ? styles.active : null
      
    return <div onClick={ this.onLike } className={ css_btn_like }>讚</div>
  }

  renderAction2 () {

    const { data, member } = this.props
    const { is_collect } = this.state
    let css_btn_collect = is_collect == 1 ? styles.active : null

    let render = <div onClick={ this.onCollect } className={ css_btn_collect }>收藏</div>

    if ( member.member_status == 2 ) {

      if ( data.user_id == member.member_info.id ) {

        render = <div onClick={()=> window.location.href="/article/edit/" + data.article_content_id }>編輯</div>
      }
    }

    return render
  }

  render () {
  	// console.log( this.props )
    const { data, member } = this.props
    const { likes } = this.state
    // console.log(data)
		return (
			<div className={ "rows_type1 " + styles.row }>
        <div className={ styles.title } onClick={ ()=> window.location.href = "/theme_detail/" + data.article_id }>{ data.title }</div>
        <div className={ styles.likes }>{ likes }</div>
        <div className={ styles.replys }>{ data.replys }</div>
        <div className={ styles.author }>
          <div className={ styles.author_name } onClick={ ()=> window.location.href = "/member_info/" + data.user_id + "/1" }>{ data.nickname }</div>
          <div>{ data.post_date }</div>
        </div>
        <div className={ "rows_edit_img " + styles.action } ref="edit_img" onClick={()=>this.toggleEdit( true )}>
          <div ref="edit" className="rows_edit">
            { this.renderAction1() }
            { this.renderAction2() }
          </div>
        </div>
        <div ref="mask" className="mask" onClick={()=>this.toggleEdit( false )}></div>
			</div>
		)
  }
}

export default connect()(ThemeArticleRow)
