import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { apiGetArticle, apiPostArticleContent, clearArticleStatus, apiUploadArticleImg } from '../../actions/article'
import styles from './ReplyArticle.css'
// import { isEmpty } from '../../utils'
import Loader from '../../components/Loader/Loader'
import Dropzone from 'react-dropzone'

import IconTitle from '../../components/IconTitle/IconTitle'
const constants = require('../../constants')

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
      img_list: []
    }
    this.onDrop = this.onDrop.bind(this)
    this.onOpenClick = this.onOpenClick.bind(this)
    this.onImgClick = this.onImgClick.bind(this)
    this.onUploadVideo = this.onUploadVideo.bind(this)
  }

  componentWillUpdate( nextProps, nextState ) {
    
    if ( nextState.reply_success == 1 ) {
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
    let content = this.refs.content.value

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
                  <div style={{"flex": "1"}}>回覆文章</div>
                  <div style={{"flex": "1"}}>
                    <div>*標題</div>
                    <span className={styles.title}>{article_info.title}</span>
                  </div>
                  <div style={{"flex": "15"}}>
                    <div style={{"alignSelf": "flex-start"}}>*內容</div>
                    <textarea ref="content" rows="15"></textarea>
                  </div>
                  <div style={{"flex": "1"}}>
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
            console.log(res)
            if( res.data.status == 1 ) {

              let url = constants.API_HOST
              let img_path = url + res.data.result.path
              let img_list = this.state.img_list
              img_list.push( img_path )
              this.setState({ img_list: img_list })
              this.refs.content.value += '<img src="' + img_path +  '"/>'
            }
            else {

              alert( file.name + '上傳失敗' )
            }
          })
      }
    })
  }

  onImgClick( event ) {
    // console.log( event.target.src )
    this.refs.content.value += '<img src="' + event.target.src + '" />'
  }

  onUploadVideo() {
    // console.log("video");
    let text = prompt('請嵌入您想分享影片程式碼, 例如 <iframe width="560" height="315" src="https://www.youtube.com/embed/DrqwF_nQMlU" frameborder="0" allowfullscreen></iframe>')
    if( text ) {
      this.refs.content.value += text
    }
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
