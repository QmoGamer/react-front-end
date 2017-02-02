import React from 'react'
import { Link } from 'react-router'
import styles from './ThemePanel.css'
import BtnAction from '../BtnAction/BtnAction'
import LikesTip from '../LikesTip/LikesTip'
import MemberTip from '../MemberTip/MemberTip'
import ThemePanelAction from '../ThemePanelAction/ThemePanelAction'
import { isEmpty, yyyymmdd } from '../../utils'
import ReactHtmlParser from 'react-html-parser'
const constants = require('../../constants');

function ThemePanel(props) {

  if ( !Array.isArray(props.content) ) {
    return <div className={styles.theme_panel}>錯誤文章</div>
  }

  // console.log(props);
  const member = props.member
  const dispatch = props.dispatch

  const article_id = props.article_id
  const article_title = props.title
  const article_post_date = yyyymmdd(props.post_time)
  const theme_child_name = props.subboard_name
  const theme_child_id = props.subboard_id
  const theme_id = props.theme_id
  const article_path = props.article_path + "/" + article_id
  const path = "http://placehold.it/600x450"
  const msgs = props.response_count
  const is_collect = props.collected

  let user_id = '0'
  let member_name = 'nickname'
  let member_posts = '0'
  let member_follows = '0'
  let member_pro_pic = constants.VIEW_ICON_TEMP_MEMBER
  let article_content = '此篇文章無內容'
  let likes = '0'
  let article_content_id = '0'
  let is_like = '0'
  let is_follow = '0'

  if ( Array.isArray(props.content) && props.content.length != 0 ) {
    let content = props.content[0]
    user_id = content.user_id
    member_name = content.nickname
    // member_pro_pic = 
    member_posts = content.user_article_count
    member_follows = content.user_follow_count
    article_content = content.content
    likes = content.like_count
    article_content_id = content.article_content_id
    is_like = content.liked
    is_follow = content.followed
  }

  // const member_id = 1
  // const member_name = "nickname"
  // const member_pro_pic = "http://placehold.it/100x100"
  // const member_posts = 20
  // const member_follows = 100
  // const theme_child_name = props.subboard_name
  // const article_id = props.article_id
  // const article_title = props.title
  // const article_post_date = post_date.getFullYear() + "-" + (post_date.getMonth() + 1) + "-" + post_date.getDate()
  // const article_content = props.content == 0 ? null : props.content[0].content
  // const path = "http://placehold.it/600x450"
  // const likes = 100
  // const msgs = props.content.length
  // const type = props.type
  // const article_content_id = !isEmpty(props.content) ? props.content[0].article_content_id : 0
  // const is_like = !isEmpty(props.content) ? props.content[0].liked : 0
  // const is_collect = props.collected

  return (
    <div className={styles.theme_panel}>
    	<div className={styles.theme_panel_padding}>
    		<MemberTip 
          member_name = {member_name}
          member_posts = {member_posts}
          member_follows = {member_follows}
          member_pro_pic = {member_pro_pic}
          article_post_date = {article_post_date}
          member = {member}
          dispatch = {dispatch}
          user_id = {user_id}
          is_follow = {is_follow}
        />
        <Link to={article_path}>
      		<div className={styles.article_title + " ellipsis"}>{article_title}</div>
        </Link>
        <Link to={"/theme/"+theme_id+"/"+theme_child_id}>
      		<div className={styles.theme_child_name}>{theme_child_name}</div>
        </Link>
        <Link to={article_path}>
      		<div className={styles.article_content + " ellipsis"} style={{"WebkitLineClamp": "2"}}>{ ReactHtmlParser(article_content) }</div>
        </Link>
    	</div>
    	<div>
        <Link to={article_path}>
    		  <img className={styles.panel_img} src={path} />
        </Link>
    	</div>
      <ThemePanelAction 
        likes={likes} 
        msgs={msgs} 
        member={member} 
        dispatch={dispatch} 
        is_like={is_like}
        is_collect={is_collect}
        article_id={article_id}
        article_content_id={article_content_id}
      />
      {
     //  <LikesTip likes={likes} msgs={msgs} />
    	// <div className="flex flex_jc_sa">
    	// 	<BtnAction 
     //      text="讚" 
     //      type="1" 
     //      member={member} 
     //      dispatch={dispatch}
     //      active={is_like} 
     //      article_content_id={article_content_id} />
     //    <BtnAction 
     //      text="收藏" 
     //      type="2"
     //      member={member} 
     //      dispatch={dispatch}
     //      active={is_collect} 
     //      article_id={article_id} />
    	// </div>
      }
    </div>
  )
}

export default ThemePanel