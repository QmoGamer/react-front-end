import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import styles from './EditMemberInfo.css'

import { apiUpdateMemberPropic, autoLogin } from '../../actions/member'
import { isEmpty, isValidSize, isPhotoType, getSessionStorageItem, checkImg } from '../../utils'
const constants = require('../../constants')

class EditProPic extends Component {

	constructor (props) {
    super(props)
    this.state = { is_editing: false, photo_path: props.member.photo_path, file: [] }
    this.onSubmit = this.onSubmit.bind(this)
    this.onOpenClick = this.onOpenClick.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  onEdit ( bool ) {

    this.setState({ is_editing: bool })
    bool == false ? this.setState({ file: [] }) : null
  }

  onOpenClick() {

    this.refs.dropzone.open()
  }

  onDrop(files) { 

    if ( files.length == 1 ) {

      files.map((file, y)=>{

        if ( !isValidSize( file.size ) ) {
          alert( constants.VIEW_TEXT_UPLOAD_1 )
        }
        else if ( !isPhotoType( file.type ) ) {
          alert( constants.VIEW_TEXT_UPLOAD_2 )
        }
        else {
          this.setState({ file: file })
        }
      })
    }
    else {
      alert( constants.VIEW_TEXT_UPLOAD_3 )
    }
  }

  onSubmit () {

    const { member_cookie, token } = this.props.member
    const { file } = this.state

    // alert('施工中')
    this.props.dispatch( apiUpdateMemberPropic( location.origin, member_cookie, token, file ) )
      .then( res => {
        // console.log( res )
        if( res.data.status == 1 ) {

          window.sessionStorage["photo_path"] = constants.API_HOST + res.data.result.imgPath
          this.setState({ is_editing: false, photo_path: constants.API_HOST + res.data.result.imgPath })
          // 重新登入替換右上角資料
          alert('更新成功')
          window.location.reload()
          // this.props.dispatch( autoLogin( getSessionStorageItem() ) )
        }
        else
          alert( res.data.error.error_msg )
      })
  }

  renderRow () {

    const { is_editing, photo_path, file } = this.state

    let img_src = checkImg( photo_path )

    if ( is_editing == true ) {

      img_src = isEmpty(file) ? img_src : file.preview

      return (
        <div className={ styles.field }>
          <div>
            <img className={ styles.pro_pic } src={ img_src } />
            <Dropzone ref="dropzone" onDrop={this.onDrop} style={{ display: "none" }}></Dropzone>
            <div className={ styles.btn_upload } onClick={ this.onOpenClick }>上傳圖片</div>
          </div>
          <div className={ styles.btns }>
            <div className={ styles.btn_submit } onClick={ this.onSubmit }>確認變更</div>
            <div className={ styles.btn_cancel } onClick={ ()=> this.onEdit( false ) }>取消</div>
          </div>
        </div>
      )
    }
    else {
      return <div><img className={ styles.pro_pic } src={ img_src } /></div>
    }
  }

  render () {

    const { is_editing } = this.state

    const css_bgcolor = is_editing == true ? styles.bgcolor : null
    const render_btn = is_editing == true ? null : <div onClick={ ()=> this.onEdit( true ) } className="btn_edit_pen_type"></div>

    return (
      <div className={ styles.row + " " + css_bgcolor }>
        <div>用戶照片</div>
        { this.renderRow() }
        <div>
          { render_btn }
        </div>
      </div>
    )
  }
}

export default connect()(EditProPic)
