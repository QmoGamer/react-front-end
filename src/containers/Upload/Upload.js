import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { apiUploadNewsImg } from '../../actions/backend'
import { isEmpty, DatetimeToMsgTime, yyyymmdd } from '../../utils'
import Loader from '../../components/Loader/Loader'
const constants = require('../../constants')
import Dropzone from 'react-dropzone'
import axios from 'axios'

class Upload extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { files: null }
    this.onDrop = this.onDrop.bind(this)
    this.onOpenClick = this.onOpenClick.bind(this)
  }

  submit() {

  }

  onDrop(files) {
    // console.log('Received files: ', files[0]);
    // this.setState({ files: files });
    let member_cookie = window.sessionStorage.getItem("cookie")
    let auth_token = window.sessionStorage.getItem("token")
    let news_id = 82
    // var canvas = document.createElement('CANVAS');
    // var dataURL = canvas.toDataURL(files[0]);
    console.log(files[0])

    this.props.dispatch( apiUploadNewsImg( location.origin, member_cookie, auth_token, news_id, files[0] ) )
  }

  onOpenClick() {
    // console.log(this.state);
    this.refs.dropzone.open();
  }

  signLoginCheck() {
    axios({url: 'http://10.128.128.120:4567/api/login_check', method: 'post', withCredentials: true}).then(res => console.log(res.data)).catch(res => console.log(res));
  }

  signOut() {
    axios({url: 'http://10.128.128.120:4567/api/logout', method: 'post', withCredentials: true}).then(res => console.log(res.data)).catch(res => console.log(res));
  }

  signLogin() {
    axios({
      url: 'http://10.128.128.120:4567/api/login', 
      method: 'post', 
      params: {
        email: 'a@hotmail.com',
        password: '12345678'
      },
      withCredentials: true
      // headers: {
      //   'Content-Type': 'application/json; charset=UTF-8'
      // }
    })
      .then(res => console.log(res.data)).catch(res => console.log(res)); 
  }

  render () {
    console.log(this.state);

    return (
      <div>
        <Dropzone ref="dropzone" onDrop={this.onDrop} style={{ display: "none" }} ></Dropzone>
        <button type="button" onClick={this.onOpenClick}>
            Open Dropzone
        </button>
        {
          this.state.files ? <div><h2>Uploading {this.state.files.length} files...</h2><div>{this.state.files.map((file, y) => <img key={"upload_img_" + y} src={file.preview} />)}</div></div> : null
        }
        <div className="btn btn-info" onClick={this.signLoginCheck}>login_check</div>
        <div className="btn btn-info" onClick={this.signOut}>logout</div>
        <div className="btn btn-info" onClick={this.signLogin}>login</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    news: state.backend
    // article: state.article
  }
}

export default connect(mapStateToProps)(Upload)
