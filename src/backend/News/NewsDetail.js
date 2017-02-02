import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import styles from './News.css'

import Loader from '../../components/Loader/Loader'
import HtmlEditor from '../../components/HtmlEditor/HtmlEditor'
import { apiUpdateNews, apiGetNews, apiUploadNewsImg } from '../../actions/backend'
import { isEmpty, yyyymmdd, isValidSize, isPhotoType, combineContentValue } from '../../utils'
const constants = require('../../constants')

class NewsDetail extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      files: null, 
      member_cookie: null, 
      auth_token: null, 
      img_list: [], 
      content_value: null 
    }
    this.onDrop = this.onDrop.bind(this)
    this.onOpenClick = this.onOpenClick.bind(this)
    this.onImgClick = this.onImgClick.bind(this)
    this.onUploadVideo = this.onUploadVideo.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // console.log(nextProps);
    if ( nextProps.action_status.api_status == 1 ) {
      alert('success')
      window.location.href = "/admin/news"
    }
    else if ( nextProps.action_status.api_status == 0 ) {
      alert( nextProps.action_status.error_msg )
    }
  }

  componentDidMount () {

    let member_cookie = window.sessionStorage.getItem('cookie') 
    let auth_token = window.sessionStorage.getItem('token')
    this.setState({ member_cookie: member_cookie, auth_token: auth_token })

    if( this.props.params.type == "update" ) {
      let news_id = this.props.params.news_id
      this.props.dispatch( apiGetNews( location.origin, news_id ) )
        .then( res => this.setState({ content_value: res.json.news_detail.result[0].content }) )
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
        let news_id = this.props.params.news_id

        this.props.dispatch( apiUploadNewsImg( location.origin, member_cookie, auth_token, news_id, file ) )
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

  submit () {

    const { content_value } = this.state

    let title = this.refs.title.value
    let type_id = this.refs.type_id.value
    let start_time = this.refs.start_time.value
    let end_time = this.refs.end_time.value
    let content = content_value
    let is_sticky = this.refs.is_sticky.checked ? "1" : "0"
    let is_delete = this.refs.is_sticky.checked ? "1" : "0"
    let is_draft = this.refs.is_sticky.checked ? "1" : "0"

    if ( isEmpty( title ) ) {
      alert("標題不得為空");
    }
    else if( title.length > 50 ) {
      alert("標題不得超過50字")
    }
    else if ( isEmpty( type_id ) ) {
      alert("類型不得為空");
    }
    else if ( isEmpty( start_time ) ) {
      alert("開始時間不得為空");
    }
    else if ( isEmpty( end_time ) ) {
      alert("結束時間不得為空");
    }
    else if ( end_time < start_time ) {
      alert('結束時間不得小於開始時間')
    }
    else if ( isEmpty( content ) ) {
      alert("內容不得為空");
    }
    else {
      // if ( this.props.params.type == "add" ) {
      //   this.props.dispatch( apiAddNews( location.origin, cookie, title, type_id, start_time, end_time, content, is_sticky, is_delete, is_disable ) )
      // }
      // else if ( ( this.props.params.type == "update" ) ) {
      let member_cookie = this.state.member_cookie
      let auth_token = this.state.auth_token
      let news_id = this.props.params.news_id
      this.props.dispatch( apiUpdateNews( location.origin, member_cookie, auth_token, news_id, title, type_id, start_time, end_time, content, is_sticky, is_delete, is_draft ) )
      // }
    }
  }

  renderform ( detail ) {
    console.log(detail);
    let render =  <div className="panel-body">
                    <div className="form-group">
                      <label>標題</label>
                      <input ref="title" className="form-control" placeholder="輸入標題" defaultValue={ detail.title } />
                    </div>
                    <div className="form-group">
                      <label>類型</label>
                      <select ref="type_id" className="form-control" defaultValue={ detail.type_id }>
                        <option value="1">公告</option>
                        <option value="2">新聞</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-lg-6">
                          <label>開始時間</label>
                          <input ref="start_time" type="date" className="form-control" defaultValue={ detail.start_time } />
                        </div>
                        <div className="col-lg-6">
                          <label>結束時間</label>
                          <input ref="end_time" type="date" className="form-control" defaultValue={ detail.end_time } />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>內容</label>
                      <HtmlEditor content_value={ detail.content } handleEditorChange={ this.handleEditorChange } />
                    </div>
                    <div className="form-group">
                      <label>圖片列表</label>
                      <Dropzone ref="dropzone" onDrop={this.onDrop} style={{ display: "none" }} ></Dropzone>
                      <div className="btn btn-warning btn-sm" style={{ margin: "10px" }} onClick={this.onOpenClick}>上傳圖片</div>
                      <div className="btn btn-warning btn-sm" style={{ margin: "10px" }} onClick={this.onUploadVideo}>嵌入影片</div>
                      <div>{ this.renderImgList( detail.img_list ) }</div>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-lg-4">
                          <label>常駐</label>
                          <label style={{marginLeft: "10px"}} className="radio-inline">
                            <input ref="is_sticky" name="is_sticky" className={styles.radio} type="radio" value="1" defaultChecked={ detail.is_sticky == 1 ? true : false } />是
                          </label>
                          <label className="radio-inline">
                            <input name="is_sticky" className={styles.radio} type="radio" value="0" defaultChecked={ detail.is_sticky == 0 ? true : false } />否
                          </label>
                        </div>
                        <div className="col-lg-4" style={{"display": "none"}}>
                          <label>刪除</label>
                          <label style={{marginLeft: "10px"}} className="radio-inline">
                            <input ref="is_delete" name="is_delete" className={styles.radio} type="radio" value="1" defaultChecked={ detail.is_delete == 1 ? true : false } />是
                          </label>
                          <label className="radio-inline">
                            <input name="is_delete" className={styles.radio} type="radio" value="0" defaultChecked={ detail.is_delete == 0 ? true : false } />否
                          </label>
                        </div>
                        <div className="col-lg-4" style={{"display": "none"}}>
                          <label>草稿</label>
                          <label style={{marginLeft: "10px"}} className="radio-inline">
                            <input ref="is_draft" name="is_draft" className={styles.radio} type="radio" value="1" defaultChecked={ detail.is_draft == 1 ? true : false } />是
                          </label>
                          <label className="radio-inline">
                            <input name="is_draft" className={styles.radio} type="radio" value="0" defaultChecked={ detail.is_draft == 0 ? true : false } />否
                          </label>
                        </div>
                      </div>
                    </div>
                    <div onClick={()=>this.submit()} className="btn btn-primary">確定</div>
                    <div onClick={()=>window.location.href="/admin/news"} className="btn btn-default" style={{margin: "0 10px"}}>返回</div>
                  </div>
    return render 
  }

  renderImgList ( img_list ) {

    return img_list.map((x, y)=><img key={'img_'+y} onClick={this.onImgClick} src={x} width="200px" height="150px" style={{ margin: "10px" }} />)
  }

  render () {
    // console.log(this.props)
    const { news_detail } = this.props

    let renderform = <Loader />
    let detail = { 
      'title': null,
      'type_id': '1',
      'start_time': yyyymmdd(new Date()),
      'end_time': '2020-01-01',
      'content': null,
      'is_sticky': '0',
      'is_delete': '0',
      'is_draft': '0',
      'img_list': this.state.img_list
    }
    console.log(detail)
    if ( this.props.params.type == 'add' ) {
      
      renderform = this.renderform( detail )
    }
    else if ( this.props.params.type == 'update' ) {

      if( news_detail != undefined ) {

        let detail_info = news_detail.result[0]
        detail.title = detail_info.title
        switch( detail_info.type ) {
          case '公告':
            detail.type_id = 1
            break;
          case '新聞':
            detail.type_id = 2
            break;
          default:
            detail.type_id = 1
            break;
        }
        detail.start_time = yyyymmdd( detail_info.start_time )
        detail.end_time = yyyymmdd( detail_info.end_time )
        detail.content = detail_info.content
        renderform = this.renderform( detail )
      }
    }

    return (
      <div ref="page" id="page-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="page-header">新聞&公告</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8">
              <div className="panel panel-info">
                <div className="panel-heading"> { this.props.params.type == 'add' ? "新增" : "修改" } </div>
                { renderform }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    news_detail: state.backend.news_detail,
    action_status: state.backend.action_status
  }
}

export default connect(mapStateToProps)(NewsDetail)
