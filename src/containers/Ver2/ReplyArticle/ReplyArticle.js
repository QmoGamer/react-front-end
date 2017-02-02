import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import styles from './ReplyArticle.css'

import Loader from '../../../components/Loader/Loader'
import IconTitle from '../../../components/IconTitle/IconTitle'
import BtnBack from '../../../components/Btns/BtnBack'
import HtmlEditor from '../../../components/HtmlEditor/HtmlEditor'
import { apiGetArticle, apiPostArticleContent, clearArticleStatus, apiUploadArticleImg } from '../../../actions/article'
import { isEmpty, isValidSize, isPhotoType, combineContentValue } from '../../../utils'
const constants = require('../../../constants')

class ReplyArticle extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      is_dispatch: 0,
      reply_success: 0,
      member_cookie: null,
      auth_token: null,
      img_list: [],
      content_value: ''
    }
    this.onDrop = this.onDrop.bind(this)
    this.onOpenClick = this.onOpenClick.bind(this)
    this.onImgClick = this.onImgClick.bind(this)
    this.onUploadVideo = this.onUploadVideo.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
  }

  componentWillUpdate( nextProps, nextState ) {
    
    if ( nextState.reply_success == 1 ) {
      alert( constants.VIEW_TEXT_ARTICLE_5 )
      this.props.history.push("/theme_detail/"+this.props.params.article_id)
    }
  }

  componentWillReceiveProps (nextProps) {

    // 先拿article_id
    if( this.state.is_dispatch == 0 && nextProps.member.member_status == 2 ) {
      this.setState({ is_dispatch: 1 })
      this.props.dispatch( apiGetArticle( location.origin, this.props.params.article_id ) )
    }

    // 回文成功
    console.log(nextProps)
    if ( nextProps.article.post_article_content != undefined ) {
      if ( nextProps.article.post_article_content.api_status == 1 ) {

        this.setState({ reply_success: 1 })
      }
      else {

        alert( nextProps.article.post_article_content.error_msg )
      }
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
    }
  }

  postArticleContent ( article_id ) {

    let member_cookie = this.props.member.member_info.member_cookie
    let member_token = this.props.member.member_info.token
    const { content_value } = this.state
    let content = content_value

    if( content.length < 1 ) {
      alert("內容不得少於20字");
    }
    else {
      this.props.dispatch( apiPostArticleContent(location.origin, member_cookie, member_token, article_id, content) )
    }
  }

  renderForm ( article ) {

    let render = <Loader />
    if ( article.article_info != undefined ) {

      let article_info = article.article_info
      render =  <div className={styles.form}>
                  <div className={ styles.row + " " + styles.topic }>
                    <BtnBack color="white" />
                    <div>回覆文章</div>
                  </div>
                  <div className={ styles.row }>
                    <div>*標題</div>
                    <span className={styles.title}>{article_info.title}</span>
                  </div>
                  <div className={ styles.row }>
                    <div>*內容</div>
                    <div className={ styles.content }>
                      <HtmlEditor content_value={this.state.content_value} handleEditorChange={this.handleEditorChange} />
                    </div>
                  </div>
                  <div className={ styles.btns }>
                    <Dropzone ref="dropzone" onDrop={this.onDrop} style={{ display: "none" }} ></Dropzone>
                    <div className={styles.btn} onClick={this.onOpenClick}>上傳圖片</div>
                    <div className={styles.btn} onClick={this.onUploadVideo}>嵌入影片</div>
                    <div className={styles.btn + ' ' + styles.btn_post} onClick={()=>this.postArticleContent( article_info.article_id )}>回覆文章</div>
                  </div>
                </div>
    }
    return render
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
        let article_id = this.props.params.article_id

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

  handleEditorChange ( event ) {

    this.setState({ content_value: event.target.getContent() });
  }

  renderImgList ( img_list ) {

    let render =  <div className={styles.img_list}>
                    <div className={styles.img_list_title}>圖片列表</div>
                    <div className={styles.img_list_imgs}>{ img_list.map((x, y)=><img key={'img_'+y} onClick={this.onImgClick} src={x} width="200px" height="150px" style={{ margin: "10px" }} />) }</div>
                  </div>
    return render
  }

  render () {
    // console.log(this.props);
    const { article } = this.props
    let img_list = this.state.img_list

    return (
      <div className={styles.post_article}>
        <div>
          <IconTitle icon_classname="fa fa-home" title="回覆文章" color="#444" />
        </div>
        <div className="form_bg">
          <div className="form_bg_border">
            { this.renderForm( article ) }
            { img_list.length != 0 ? this.renderImgList( img_list ) : null }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    member: state.member,
    article: state.article
  }
}

export default connect(mapStateToProps)(ReplyArticle)
