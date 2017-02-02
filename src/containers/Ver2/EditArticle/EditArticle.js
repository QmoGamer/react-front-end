import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import styles from './EditArticle.css'

import Loader from '../../../components/Loader/Loader'
import IconTitle from '../../../components/IconTitle/IconTitle'
import BtnBack from '../../../components/Btns/BtnBack'
import HtmlEditor from '../../../components/HtmlEditor/HtmlEditor'
import { apiGetArticleContent, apiUpdateArticleContent, apiUploadArticleImg } from '../../../actions/article'
import { isEmpty, isValidSize, isPhotoType, combineContentValue } from '../../../utils'
const constants = require('../../../constants')

class EditArticle extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      data: null,
      member_cookie: null,
      auth_token: null,
      loading: true,
      img_list: [],
      article_id: null,
      article_content_id: this.props.params.article_content_id,
      content_value: null
    }
    this.onDrop = this.onDrop.bind(this)
    this.onOpenClick = this.onOpenClick.bind(this)
    this.onImgClick = this.onImgClick.bind(this)
    this.onUploadVideo = this.onUploadVideo.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
    this.UpdateArticleContent = this.UpdateArticleContent.bind(this)
  }

  componentDidMount () {

    let member_cookie = window.sessionStorage.getItem('cookie')
    let auth_token = window.sessionStorage.getItem('token')
    let article_content_id = this.state.article_content_id

    // 檢查是否登入會員 
    if ( member_cookie == undefined || auth_token == undefined ) {

      alert('請先登入會員')
      window.location.href = '/member_login'
    }
    else {

      this.props.dispatch( apiGetArticleContent( location.origin, member_cookie, auth_token, article_content_id ) )
        .then( res => {
          
          if( res.data.status == 1 ) {

            let data = res.data.result[0]
            this.setState({ data: data, member_cookie: member_cookie, auth_token: auth_token, article_id: data.article_id, content_value: data.content })
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  componentDidUpdate(prevProps, prevState) { 

    if( !isEmpty(this.state.data) && this.state.loading == true ) {

      this.setState({ loading: false })
    }
  }

  onOpenClick() {

    this.refs.dropzone.open()
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

        const { member_cookie, auth_token, article_id } = this.state

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

  UpdateArticleContent () {

    const { member_cookie, auth_token, article_content_id, article_id, content_value } = this.state
    let content = content_value

    if( content.length < 20 ) {
      alert("內容不得少於20字");
    }
    else {
      // console.log('end')
      this.refs.loading.style.display = "block"
      this.props.dispatch( apiUpdateArticleContent( location.origin, member_cookie, auth_token, article_content_id, content ) )
        .then( res => {

          if( res.data.status == 1 ) {

            alert( constants.VIEW_TEXT_ARTICLE_6 )
            window.location.href = '/theme_detail/' + article_id
          }
          else
            
            alert( res.data.error.error_msg )
        })
    }
  }

  handleEditorChange ( event ) {

    this.setState({ content_value: event.target.getContent() });
  }

  renderForm (data) {
    // console.log(this.state.content_value)
    let render =  <div className={ styles.form }>
                    <div className={ styles.row + " " + styles.topic }>
                      <BtnBack color="white" />
                      <div>編輯文章</div>
                    </div>
                    <div className={ styles.row }>
                      <div>*標題</div>
                      <div>{ data.title }</div>
                    </div>
                    <div className={ styles.row }>
                      <div>*內容</div>
                      <div className={ styles.content }>
                        <HtmlEditor content_value={this.state.content_value} handleEditorChange={this.handleEditorChange} />
                      </div>
                    </div>
                    <div className={ styles.btns }>
                      <Dropzone ref="dropzone" onDrop={this.onDrop} style={{ display: "none" }}></Dropzone>
                      <div className={styles.btn} onClick={this.onOpenClick}>上傳圖片</div>
                      <div className={styles.btn} onClick={this.onUploadVideo}>嵌入影片</div>
                      <div className={styles.btn + ' ' + styles.btn_post} onClick={this.UpdateArticleContent}>儲存文章</div>
                    </div>
                  </div>

    return render
  }

  renderImgList ( img_list ) {

    let render =  <div className={styles.img_list}>
                    <div className={styles.img_list_title}>圖片列表</div>
                    <div className={styles.img_list_imgs}>
                      { 
                        img_list.map((x, y)=> {
                          return (
                            <div key={'img_'+y} className="img_list_item">
                              <img onClick={this.onImgClick} src={x} />
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
    return render
  }

  render () {
    // console.log(this.state.content_value);
    let render_renderForm = <Loader />
    let render_img_list = <Loader />

    const { data, img_list, loading } = this.state 

    if( loading == false ) {

      render_renderForm = this.renderForm( data )
      render_img_list = img_list.length != 0 ? this.renderImgList( img_list ) : null
    }

    return (
      <div className={styles.post_article}>
        <div>
          <IconTitle icon_classname="fa fa-home" title="編輯文章" color="#444" />
        </div>
        <div className="form_bg">
          <div className="form_bg_border">
            { render_renderForm }
            { render_img_list }
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
    // member: state.member
    // article: state.article
  }
}

export default connect(mapStateToProps)(EditArticle)
