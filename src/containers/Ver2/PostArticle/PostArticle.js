import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Dropzone from 'react-dropzone'
import styles from './PostArticle.css'

import Loader from '../../../components/Loader/Loader'
import IconTitle from '../../../components/IconTitle/IconTitle'
import BtnBack from '../../../components/Btns/BtnBack'
import HtmlEditor from '../../../components/HtmlEditor/HtmlEditor'
import { apiPostArticle, apiPostArticleContent, apiUpdateArticle, clearArticleStatus, apiUploadArticleImg } from '../../../actions/article'
import { selectTheme } from '../../../actions/theme'
import { isEmpty, isValidSize, isPhotoType, combineContentValue } from '../../../utils'
const constants = require('../../../constants')

class PostArticle extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      loading: 1,
      data: [],
      post_success: 0,
      select_theme_id: props.select_theme.select_theme_id,
      select_sub_theme_id: props.select_theme.select_sub_theme_id,
      img_list: [],
      article_id: null,
      member_cookie: null,
      auth_token: null,
      content_value: null
    }
    this.changeSelectTheme = this.changeSelectTheme.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onOpenClick = this.onOpenClick.bind(this)
    this.onImgClick = this.onImgClick.bind(this)
    this.onUploadVideo = this.onUploadVideo.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
  }

  componentWillUpdate( nextProps, nextState ) {

    if ( nextState.post_success == 1 ) {
      alert( constants.VIEW_TEXT_ARTICLE_4 )
      let select_theme_id = this.refs.theme_id.value
      let select_sub_theme_id = this.refs.sub_theme_id.value
      window.location.href = "/theme/"+select_theme_id+"/"+select_sub_theme_id
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log(nextProps);
    // // 先拿article_id
    // if( this.state.is_dispatch == 0 && nextProps.member.member_status == 2 ) {
    //   let member_cookie = nextProps.member.member_info.member_cookie
    //   let member_token = nextProps.member.member_info.token
    //   this.setState({ is_dispatch: 1 })
    //   this.props.dispatch( apiPostArticle( location.origin, member_cookie, member_token ) )
    // }

    // // 發文成功轉跳頁面
    // if ( nextProps.article.update_article != undefined && nextProps.article.post_article_content != undefined ) {
    //   if ( nextProps.article.update_article.api_status == 1 && nextProps.article.post_article_content.api_status == 1 ) {
    //     // alert('post_success')
    //     this.setState({ post_success: 1 })
    //   }
    // }

    if( nextProps.article != this.props.article && isEmpty( this.state.data ) ) {

      this.setState({ data: nextProps.article.post_article, article_id: nextProps.article.post_article.article_id })
    }
    else if( nextProps.article.update_article != undefined && this.state.post_success == 0 ) {

      if( nextProps.article.update_article.api_status == 1 ) {

        this.setState({ post_success: 1 })
      }
    }
    else if( nextProps.article.post_article_content != undefined && this.state.post_success == 0 ) {

      if( nextProps.article.post_article_content.api_status == 1 ) {

        let member_cookie = this.props.member.member_info.member_cookie
        let member_token = this.props.member.member_info.token
        let article_id = this.props.article.post_article.article_id
        let sub_theme_id = this.refs.sub_theme_id.value
        let title = this.refs.title.value
        this.props.dispatch( apiUpdateArticle(location.origin, member_cookie, member_token, article_id, sub_theme_id, title) )
      }
    }
  }

  componentDidUpdate( prevProps, prevState ) {

    if( isEmpty( this.state.data ) && prevProps.member.member_status == 2 ) {

      let member_cookie = prevProps.member.member_info.member_cookie
      let member_token = prevProps.member.member_info.token
      this.props.dispatch( apiPostArticle( location.origin, member_cookie, member_token ) )
    }

    if ( !isEmpty( this.state.data ) && this.state.loading == 1 ) {
      this.setState({ loading: 0 })
    }
  }

  componentDidMount () {

    // 檢查是否登入會員 
    if ( window.sessionStorage.getItem('cookie') == undefined || window.sessionStorage.getItem('token') == undefined ) {
      window.location.href = "/member_login"
    }
    else {

      let member_cookie = window.sessionStorage.getItem('cookie')
      let auth_token = window.sessionStorage.getItem('token')

      this.setState({ member_cookie: member_cookie, auth_token: auth_token })
      this.props.dispatch( selectTheme( 0, 0 ) )
    }
  }

  renderTheme ( theme ) {

    let render = <Loader />
    if( theme != undefined ) {
       render = <select ref="theme_id" onChange={this.changeSelectTheme} defaultValue={this.state.select_theme_id}>
                  { theme.result.map((x, y)=><option key={"theme_"+y} value={x.id}>{x.name}</option>) }
                </select>
    }
    return render
  }

  renderSubTheme ( theme, theme_id ) {

    let render = <Loader />
    if( theme != undefined ) {

      let select_theme = theme.result
      if( theme_id != 0 )
        select_theme = theme.result.filter((x, y)=>x.id == theme_id)

      render =  <select ref="sub_theme_id" onChange={(e)=>this.setState({select_sub_theme_id: e.target.value})} value={this.state.select_sub_theme_id}>
                  { select_theme[0].subboard.map((x, y)=><option key={"theme_"+y} value={x.id}>{x.name}</option>) }
                </select>
    }
    return render
  }

  changeSelectTheme ( event ) {

    this.setState({ select_theme_id: event.target.value, select_sub_theme_id: 0 })
  }

  postArticleContent ( member, article ) {

    const { content_value } = this.state

    let member_cookie = member.member_info.member_cookie
    let member_token = member.member_info.token
    let article_id = article.post_article.article_id
    let sub_theme_id = this.refs.sub_theme_id.value
    let title = this.refs.title.value
    let content = content_value

    if ( isEmpty(title) ) {
      alert("標題不得為空");
    }
    else if( title.length > 50 ) {
      alert("標題不得超過50字")
    }
    else if( content.length < 20 ) {
      alert("內容不得少於20字");
    }
    else {
      this.refs.loading.style.display = "block"
      this.props.dispatch( apiPostArticleContent(location.origin, member_cookie, member_token, article_id, content) )
    }
  }

  onOpenClick() {

    this.refs.dropzone.open();
  }

  onDrop(files) { 

    files.map((file, y)=>{

      if ( !isValidSize( file.size ) ) {
        alert( constants.VIEW_TEXT_UPLOAD_1 )
      }
      else if ( !isPhotoType( file.type ) ) {
        alert( constants.VIEW_TEXT_UPLOAD_2 )
      }
      else {

        let member_cookie = this.state.member_cookie
        let auth_token = this.state.auth_token
        let article_id = this.state.article_id

        this.props.dispatch( apiUploadArticleImg( location.origin, member_cookie, auth_token, article_id, file ) )
          .then((res) => {

            if( res.data.status == 1 ) {

              const { img_list, content_value } = this.state
              let url = constants.UPLOAD_IMG_URL
              let img_path = url + res.data.result.path
              let new_content_value = combineContentValue( content_value, img_path )

              img_list.push( img_path )
              tinymce.activeEditor.setContent( new_content_value )
              this.setState({ img_list: img_list, content_value: new_content_value })
            }
            else {

              alert( file.name + '上傳失敗' )
            }
          })
      }
    })
  }

  onImgClick( event ) {
    
    const { content_value } = this.state
    let src = event.target.src
    let new_content_value = combineContentValue( content_value, src )

    tinymce.activeEditor.setContent( new_content_value )
    this.setState({ content_value: new_content_value })
  }

  onUploadVideo() {
    // console.log("video");
    let text = prompt('請嵌入您想分享影片程式碼, 例如 <iframe width="560" height="315" src="https://www.youtube.com/embed/DrqwF_nQMlU" frameborder="0" allowfullscreen></iframe>')
    if( text ) {

      const { content_value } = this.state
      let new_content_value = content_value + text

      tinymce.activeEditor.setContent( new_content_value )
      this.setState({ content_value: new_content_value })
      // this.refs.content.value += text
    }
  }

  handleEditorChange (e) {

    this.setState({ content_value: e.target.getContent() });
  }

  renderContent() {

    const { content_value } = this.state

    return  <div className={ styles.row }>
              <div style={{"alignSelf": "flex-start"}}>*內容</div>
              <div className={ styles.content }>
                <HtmlEditor content_value={ content_value } handleEditorChange={ this.handleEditorChange } />
              </div>
            </div>
  }

  renderImgList ( img_list ) {

    let render =  <div className={styles.img_list}>
                    <div className={styles.img_list_title}>圖片列表</div>
                    <div className={styles.img_list_imgs}>{ img_list.map((x, y)=><img key={'img_'+y} onClick={this.onImgClick} src={x} width="200px" height="150px" style={{ margin: "10px" }} />) }</div>
                  </div>
    return render
  }

  render () {
    console.log(this.props);
    const { theme, member, article } = this.props
    const { loading, select_theme_id, img_list, content_value } = this.state

    let render_content = <Loader />

    if ( loading == false ) {

      render_content = this.renderContent()
    }

    return (
      <div className={styles.post_article}>
        <div>
          <IconTitle icon_classname="fa fa-home" title="發表文章" color="#444" />
        </div>
        <div className="form_bg">
          <div className="form_bg_border">
            <div className={styles.form}>
              <div className={ styles.row + " " + styles.topic }>
                <BtnBack color="white" />
                <div>發表文章</div>
              </div>
              <div className={ styles.row }>
                <div>*分類</div>
                { this.renderTheme( theme ) }
              </div>
              <div className={ styles.row }>
                <div>*次分類</div>
                { this.renderSubTheme( theme, select_theme_id ) }
              </div>
              <div className={ styles.row }>
                <div>*標題</div>
                <input ref="title" />
              </div>
              { render_content }
              <div className={ styles.btns }>
                <Dropzone ref="dropzone" onDrop={this.onDrop} style={{ display: "none" }} ></Dropzone>
                <div className={styles.btn} onClick={this.onOpenClick}>上傳圖片</div>
                <div className={styles.btn} onClick={this.onUploadVideo}>嵌入影片</div>
                <div className={styles.btn + ' ' + styles.btn_post} onClick={()=>this.postArticleContent( member, article )}>送出文章</div>
              </div>
              { img_list.length != 0 ? this.renderImgList( img_list ) : null }
            </div>
          </div>
        </div>
        <div ref="loading" className="loading"></div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    member: state.member,
    article: state.article,
    theme: state.home.theme,
    select_theme: state.theme
  }
}

export default connect(mapStateToProps)(withRouter(PostArticle))
