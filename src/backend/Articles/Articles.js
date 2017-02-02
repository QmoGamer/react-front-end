import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Griddle from 'griddle-react'
import _ from 'underscore'
import squish from 'object-squish'
import styles from './Articles.css'

import Loader from '../../components/Loader/Loader'

import { ver2_apiGetTheme, apiGetArticleList, apiMoveArticle, apiRemoveArticle } from '../../actions/backend'
import { isEmpty, yyyymmdd } from '../../utils'

var CheckboxComponent = React.createClass({

  render: function(){

    let data = this.props.rowData

    return <input type="checkbox" value={ data.article_id } className={ "checkbox " + styles.input_checkbox } />
  }
});

var LinkComponent = React.createClass({

  render: function(){

    let data = this.props.rowData

    return <a className={ styles.link } href={ "/admin/article_detail/" + data.article_id }>{ data.title }</a>
  }
});

var IsDeleteComponent = React.createClass({

  render: function(){

    let data = this.props.rowData

    return <div>{ data.isdelete == 1 ? "已刪除" : "正常" }</div>
  }
});

class Articles extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      loading: true,
      theme: [],
      sub_theme: [],
      data: [],
      theme_id: 0,
      sub_theme_id: 0
    }
    this.allCheck = this.allCheck.bind(this);
    this.clearCheck = this.clearCheck.bind(this);
    this.customFilterFunction = this.customFilterFunction.bind(this);
    this.onThemeChange = this.onThemeChange.bind(this);
    this.onSubThemeChange = this.onSubThemeChange.bind(this);
    this.dispatchApi = this.dispatchApi.bind(this);
    this.moveArticle = this.moveArticle.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
  }

  componentDidMount () {

    const { page } = this.props.params

    this.props.dispatch( ver2_apiGetTheme( location.origin ) )
      .then( res => {

        if( res.data.status == 1 ) {

          this.setState({ theme: res.data.result }) 
        }
        else
          alert( res.data.error.error_msg )
      })
    this.dispatchApi()
  }

  componentDidUpdate () {

    const { loading, data, theme } = this.state

    if( !isEmpty( data ) && !isEmpty( theme ) && loading == true ) {

      this.setState({ loading: false })
    }
  }

  dispatchApi ( theme_id=0, sub_theme_id=0 ) {
    // console.log(theme_id)
    this.clearCheck()

    this.props.dispatch( apiGetArticleList( location.origin, theme_id, sub_theme_id ) )
      .then( res => {

        if( res.data.status == 1 ) {

          this.setState({ data: res.data.result })
        }
        else
          alert( res.data.error.error_msg )
      })
  }

  moveArticle () {
    // console.log('move')
    let checkboxs = document.getElementsByClassName('checkbox')
    let checkeds = []
    let move_sub_theme_id = this.refs.dialog_sub_theme.value
    let moves = []

    for (var i = 0; i < checkboxs.length; i++) {

      if( checkboxs[i].checked == true ) {

        checkeds.push( checkboxs[i].value )
        moves.push( move_sub_theme_id )
      }
    }
      
    if ( checkeds.length == 0 ) {

      alert('請選擇一個文章移動')
    }
    else {

      console.log(checkeds, moves)
      this.props.dispatch( apiMoveArticle( location.origin, checkeds, moves ) )
        .then( res => {

          if ( res.data.status == 1 ) {

            alert('移動成功')
            window.location.href = "/admin/articles"
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }

  removeArticle () {
    // console.log('remove')
    let checkboxs = document.getElementsByClassName('checkbox')
    let checkeds = []
    let reason = this.refs.reason.value
    let reasons = []

    for (var i = 0; i < checkboxs.length; i++) {

      if( checkboxs[i].checked == true ) {

        checkeds.push( checkboxs[i].value )
        reasons.push( reason )
      }
    }

    if ( checkeds.length == 0 ) {

      alert('請選擇一個文章刪除')
    }
    else if ( reason == '' ) {
      
      alert('請輸入原因')
    }
    else {

      console.log(checkeds, reasons)
      this.props.dispatch( apiRemoveArticle( location.origin, checkeds, reasons ) )
        .then( res => {

          if ( res.data.status == 1 ) {

            alert('刪除成功')
            window.location.href = "/admin/articles"
          }
          else
            alert( res.data.error.error_msg )
        })
    }
  }
 
  allCheck () {

    let all_check = this.refs.all_check
    let checkboxs = document.getElementsByClassName('checkbox')

    if( all_check.checked == true ) {

      all_check.checked = false
      for (var i = 0; i < checkboxs.length; i++) {
        checkboxs[i].checked = false
      }
    }
    else {

      all_check.checked = true
      for (var i = 0; i < checkboxs.length; i++) {
        checkboxs[i].checked = true
      }
    }
  }

  clearCheck () {

    let all_check = this.refs.all_check
    let checkboxs = document.getElementsByClassName('checkbox')

    all_check.checked = false
    for (var i = 0; i < checkboxs.length; i++) {
      checkboxs[i].checked = false
    }
  }

  customFilterFunction ( items, query ) {

    this.clearCheck()

    return _.filter(items, (item) => {
      var flat = squish(item);

      for (var key in flat) {
        //過濾條件
        if( key == "title" || key == "mainboard_name" || key == "subboard_name" ) {
          if (String(flat[key]).toLowerCase().indexOf(query.toLowerCase()) >= 0) return true;
        }
      };
      return false;
    });
  }

  onThemeChange ( event ) {
    // console.log( event.target.value )
    const { theme } = this.state
    const value = event.target.value

    value == 0 ? this.setState({ loading: true, sub_theme: [], theme_id: 0, sub_theme_id: 0 }) : theme.map((x, y)=> { if( x.id == value ) { this.setState({ loading: true, sub_theme: x.subboard, theme_id: value, sub_theme_id: 0 }) }})
    this.dispatchApi( value, 0 )
  }

  onSubThemeChange ( event ) {
    // console.log( event.target.value )
    const value = event.target.value
    const { theme_id } = this.state

    value == 0 ? this.setState({ loading: true, sub_theme_id: 0 }) : this.setState({ loading: true, sub_theme_id: value })
    this.dispatchApi( theme_id, value )
  }

  renderTheme () {
    // console.log( this.state )
    const { theme, sub_theme, theme_id, sub_theme_id } = this.state

    return  <div className="flex">
              <select defaultValue={ theme_id } onChange={ this.onThemeChange } className={ styles.category + " form-control" } style={{ marginLeft: "10px" }}>
                <option value="0">請選擇主題...</option>
                { theme.map((x, y)=> <option key={ "theme_" + y } value={ x.id }>{ x.name }</option>) }
              </select>
              <select defaultValue={ sub_theme_id } onChange={ this.onSubThemeChange } className={ styles.category + " form-control" } style={{ marginLeft: "10px" }}>
                <option value="0">請選擇次主題...</option>
                { sub_theme.map((x, y)=> <option key={ "sub_theme" + y } value={ x.id }>{ x.name }</option>) }
              </select>
            </div>
  }

  renderTable () {
    // console.log( this.state )
    const { data } = this.state

    var columnMeta = [
      {
        "columnName": "article_id",
        "customComponent": CheckboxComponent,
        "sortable": false,
        "displayName": "勾選"
      },
      {
        "columnName": "title",
        "customComponent": LinkComponent,
        "displayName": "標題"
      },
      {
        "columnName": "mainboard_name",
        "displayName": "主題"
      },
      {
        "columnName": "subboard_name",
        "displayName": "次主題"
      },
      {
        "columnName": "isdelete",
        "customComponent": IsDeleteComponent,
        "displayName": "狀態"
      }
    ];

    return  <div className={ styles.table }>
               <Griddle 
                results={ data } 
                columnMetadata={columnMeta}
                // useCustomRowComponent={true} 
                // customRowComponent={ OtherComponent } 
                // customRowComponentClassName={ styles.custom_row } 
                showFilter={true}
                useCustomFilterer={true} 
                customFilterer={ this.customFilterFunction }
                resultsPerPage={15}
                columns={["article_id", "title", "mainboard_name", "subboard_name", "isdelete"]}
              />
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

  render () {

    const { loading } = this.state;
    let render_table = <Loader />
    let render_theme = <Loader />
    let render_move_dialog = <Loader />
    let render_remove_dialog = <Loader />

    if( loading == false ) {

      render_table = this.renderTable()
      render_theme = this.renderTheme()
      render_move_dialog = this.renderMoveDialog()
      render_remove_dialog = this.renderRemoveDialog()
    }

    return (
      <div id="page-wrapper" style={{ overflow: 'auto' }}>
        <div className="container-fluid" style={{ width: '1030px', margin:'0' }}>
          <div className="page-header">
            <h2>Article List</h2>
          </div>
          <div className="page-body">
            <div className={ styles.actions }>
              <div className="flex">
                <div className={ styles.btn_all_check + " btn btn-default" } onClick={this.allCheck}>
                  <input ref="all_check" type="checkbox" />
                  <div className={ styles.faker }></div>
                  <span>全選</span>
                </div>
                <input ref="search" onChange={this._onFilterChange} className={ styles.search + " form-control" } style={{ marginLeft: "10px", display: "none" }} placeholder="Search..." />
                { render_theme }
              </div>
              <div>
                <div data-toggle="modal" data-target="#move_dialog" className="btn btn-success">移動</div>
                <div data-toggle="modal" data-target="#remove_dialog" className="btn btn-danger" style={{ marginLeft: "10px" }}>刪除</div>
                { render_move_dialog }
                { render_remove_dialog }
              </div>
            </div>
            { render_table }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    // news: state.backend.news,
    // action_status: state.backend.action_status
  }
}

export default connect(mapStateToProps)(Articles)
