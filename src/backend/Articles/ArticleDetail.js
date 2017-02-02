import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'
import styles from './ArticleDetail.css'

import Loader from '../../components/Loader/Loader'

import { apiGetArticle, apiMoveArticle, apiRemoveArticle, ver2_apiGetTheme, apiRemoveArticleContent } from '../../actions/backend'
import { isEmpty, yyyymmdd } from '../../utils'
const constants = require('../../constants')

class ArticleDetail extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      loading: true,
      data: [],
      theme: []
    }
    this.moveArticle = this.moveArticle.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
    this.removeReply = this.removeReply.bind(this);
  }

  componentDidMount () {

    const { article_id } = this.props.params

    this.props.dispatch( ver2_apiGetTheme( location.origin ) )
      .then( res => {

        if( res.data.status == 1 ) {

          this.setState({ theme: res.data.result }) 
        }
        else
          alert( res.data.error.error_msg )
      })

    this.props.dispatch( apiGetArticle( location.origin, article_id ) )
      .then( res => {
        // console.log( res )
        if( res.data.status == 1 ) {

          this.setState({ data: res.data.result[0] })
        }
        else
          alert( res.data.error.error_msg )
      })
  }

  componentDidUpdate () {

    const { loading, data } = this.state

    if( !isEmpty( data ) && loading == true ) {

      this.setState({ loading: false })
    }
  }

  moveArticle () {
    // console.log('move')
    const { article_id } = this.props.params
    let checkeds = []
    let move_sub_theme_id = this.refs.dialog_sub_theme.value
    let moves = []

    checkeds.push( article_id )
    moves.push( move_sub_theme_id )
      
    if ( checkeds.length == 0 ) {

      alert('請選擇一個文章移動')
    }
    else {

      console.log(checkeds, moves)
      this.props.dispatch( apiMoveArticle( location.origin, checkeds, moves ) )
        .then( res => {

          if ( res.data.status == 1 ) {

            alert('移動成功')
            window.location.href = "/admin/articles/" + article_id
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  removeArticle () {
    // console.log('remove')
    const { article_id } = this.props.params
    let checkeds = []
    let reason = this.refs.reason.value
    let reasons = []

    checkeds.push( article_id )
    reasons.push( reason )

    if ( checkeds.length == 0 ) {

      alert('請選擇一個文章刪除')
    }
    else if ( reason == '' ) {
      
      alert('請輸入原因')
    }
    else {

      // console.log(checkeds, reasons)
      this.props.dispatch( apiRemoveArticle( location.origin, checkeds, reasons ) )
        .then( res => {

          if ( res.data.status == 1 ) {

            alert('刪除成功')
            window.location.href = "/admin/article_detail/" + article_id
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  removeReply ( article_content_id ) {

    let reason = this.refs['reason_'+article_content_id].value

    if ( reason == '' ) {
      
      alert('請輸入原因')
    }
    else {

      this.props.dispatch( apiRemoveArticleContent( location.origin, article_content_id, reason ) )
        .then( res => {

          if ( res.data.status == 1 ) {

            alert('刪除成功')
            window.location.reload()
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  renderTitle () {

    const { data } = this.state

    return <h1 className="page-header">{ data.title }</h1>
  }

  renderArticle () {

    const { data } = this.state
    // console.log( data )
    return  <div className="form_bg">
              <div className="form_bg_border">
                <div className={ styles.article }>
                  { 
                    data.content.map((x, y)=>{ 
                      // console.log(x.article_content_id)
                      let btn_delete_reply = y == 0 ? null : <div data-toggle="modal" data-target={ "#remove_reply_dialog_" + x.article_content_id } className="btn btn-danger btn-sm">刪除回文</div>

                      return (
                        <div key={ y } className={ styles.reply }>
                          <div className={ styles.name }>
                            <div>{ x.nickname }</div>
                            <div>{ yyyymmdd( x.post_time ) }</div>
                          </div>
                          <div className={ styles.content }>{ ReactHtmlParser( x.content ) }</div>
                          { btn_delete_reply }
                          { this.renderRemoveReplyDialog( x.article_content_id ) }
                        </div>
                      )
                    }) 
                  }
                </div>
              </div>
            </div>
  }

  renderMoveDialog () {

    const { theme } = this.state

    return  <div className="modal fade" id="move_dialog" tabIndex="-1" role="dialog" style={{display: "none"}}>
              <div className="modal-dialog" style={{marginTop: "20%"}}>
                <div className="modal-content">
                  <div className="modal-body flex">
                    <select ref="dialog_sub_theme" className={ styles.dialog_sub_theme }>
                      {  
                        theme.map((x, y)=> x.subboard.map((x2, y2)=> <option key={ "dialog_sub_theme_" + y2 } value={ x2.id }>{ x2.name }</option> ))
                      }
                    </select>
                    <button onClick={ this.moveArticle } type="button" className="btn btn-success" style={{marginLeft: "8px"}}>確定</button>
                    <button type="button" className="btn btn-default" data-dismiss="modal" style={{marginLeft: "8px"}}>取消</button>
                  </div>
                </div>
              </div>
            </div>
  }

  renderRemoveDialog () {

    return  <div className="modal fade" id="remove_dialog" tabIndex="-1" role="dialog" style={{display: "none"}}>
              <div className="modal-dialog" style={{marginTop: "20%"}}>
                <div className="modal-content">
                  <div className="modal-body flex">
                    <input ref="reason" className="form-control" placeholder="請輸入原因..." />
                    <button onClick={ this.removeArticle } type="button" className="btn btn-danger" style={{marginLeft: "8px"}}>刪除</button>
                    <button type="button" className="btn btn-default" data-dismiss="modal" style={{marginLeft: "8px"}}>取消</button>
                  </div>
                </div>
              </div>
            </div>
  }

  renderRemoveReplyDialog ( article_content_id ) {

    return  <div className="modal fade" id={ "remove_reply_dialog_" + article_content_id } tabIndex="-1" role="dialog" style={{display: "none"}}>
              <div className="modal-dialog" style={{marginTop: "20%"}}>
                <div className="modal-content">
                  <div className="modal-body flex">
                    <input ref={ "reason_" + article_content_id } className="form-control" placeholder="請輸入原因..." />
                    <button onClick={ ()=> this.removeReply( article_content_id ) } type="button" className="btn btn-danger" style={{marginLeft: "8px"}}>刪除</button>
                    <button type="button" className="btn btn-default" data-dismiss="modal" style={{marginLeft: "8px"}}>取消</button>
                  </div>
                </div>
              </div>
            </div>
  }

  render () {
    // console.log(this.props)
    const { loading } = this.state
    let render_article = <Loader />
    let render_title = <Loader />
    let render_move_dialog = <loading />
    let render_remove_dialog = <loading />
    // let render_remove_reply_dialog = <loading />

    if( loading == false ) {

      render_title = this.renderTitle()
      render_article = this.renderArticle()
      render_move_dialog = this.renderMoveDialog()
      render_remove_dialog = this.renderRemoveDialog()
      // render_remove_reply_dialog = this.renderRemoveReplyDialog()
    }

    return (
      <div id="page-wrapper">
        <div className="container-fluid">
          <div className="row">
            { render_title }
          </div>
          <div className="row">
            <div className="col-xs-8">
              { render_article }
            </div>
            <div className={ styles.btns + " col-xs-2" }>
              <div className="btn btn-warning" onClick={()=> window.location.href="/admin/articles" }>回到列表</div>
              <div data-toggle="modal" data-target="#move_dialog" className="btn btn-success">移動文章</div>
              <div data-toggle="modal" data-target="#remove_dialog" className="btn btn-danger">刪除文章</div>
              { render_move_dialog }
              { render_remove_dialog }
              <div style={{ display: "none" }}>刪除所有回文</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(ArticleDetail)
