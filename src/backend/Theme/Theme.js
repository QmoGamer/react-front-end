import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { apiGetThemeList, apiAddTheme, apiAddSubTheme, apiUpdateTheme, apiUpdateSubTheme, apiDeleteTheme, apiDeleteSubTheme } from '../../actions/backend'
import styles from './Theme.css'
import Loader from '../../components/Loader/Loader'
import { isEmpty } from '../../utils'

class Theme extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
  
  }

  componentWillReceiveProps (nextProps) {
    // console.log(nextProps);
    if ( nextProps.theme_action_status.status == 1 ) {
      window.location.href = "/admin/theme"
    }

    if ( nextProps.theme_action_status.error != undefined ) {
      alert( nextProps.theme_action_status.error.error_code )
    }
  }

  componentDidMount () {
    // console.log('did');
    let cookie = encodeURIComponent( window.sessionStorage.getItem('cookie') )
    if ( cookie != "null" ) {
      this.setState({ cookie: cookie })
      this.props.dispatch( apiGetThemeList(location.origin) )
    }
    else {
      window.location.href = "/admin/login"
    }
  }

  renderThemeList( theme ) {

    let render = <Loader />

    if ( theme != undefined ) {

      render =  <div className="panel-body">
                  <div className={"table-responsive " + styles.table}>
                    <div className="flex">
                      <div style={{"flex": "3"}}>名稱</div>
                      <div style={{"flex": "1"}}>編輯</div>
                    </div>
                    {
                      theme.result.map((x, y)=>{
                        return (
                          <div key={"theme_"+y}>
                            <div className="flex flex_ai_c">
                              <a className={styles.theme_name} style={{"flex": "3", "padding": "8px 0"}} data-toggle="collapse" href={"#theme_"+x.id} aria-expanded="true">{x.name}</a>
                              <div style={{"flex": "1", "alignItems": "center", "margin": "0 10px"}} className="flex">
                                <div className="btn btn-success btn-sm" data-toggle="modal" data-target={"#theme_dialog_"+y}>編輯</div>
                                <div onClick={()=>this.submitDelete( 1, x.id )} style={{"marginLeft": "10px"}} className="btn btn-danger btn-sm">刪除</div>
                                <div className="modal fade" id={"theme_dialog_"+y} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{display: "none"}}>
                                  <div className="modal-dialog" style={{marginTop: "20%"}}>
                                    <div className="modal-content">
                                      <div className="modal-body flex">
                                        <input ref={"update_name_"+x.id} className="form-control" placeholder="輸入名稱" defaultValue={x.name} />
                                        <button onClick={()=>this.submitUpdate( 1, x.id )} type="button" className="btn btn-primary" style={{marginLeft: "8px"}}>儲存</button>
                                        <button type="button" className="btn btn-default" data-dismiss="modal" style={{marginLeft: "8px"}}>取消</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div id={"theme_"+x.id} className="panel-collapse collapse" aria-expanded="true">
                              <div className="panel-body">
                                {
                                  x.subboard.map((x2, y2)=>{
                                    return (
                                      <div key={"sub_theme_"+y2} className="flex flex_ai_c" style={{padding: "4px"}}>
                                        <div style={{"flex": "3"}}>{x2.name}</div>
                                        <div style={{"flex": "1", "alignItems": "center", "margin": "0 10px"}} className="flex">
                                          <div className="btn btn-success btn-sm" data-toggle="modal" data-target={"#sub_theme_dialog_"+y+"_"+y2}>編輯</div>
                                          <div onClick={()=>this.submitDelete( 2, x2.id )} style={{"marginLeft": "10px"}} className="btn btn-danger btn-sm">刪除</div>
                                          <div className="modal fade" id={"sub_theme_dialog_"+y+"_"+y2} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{display: "none"}}>
                                            <div className="modal-dialog" style={{marginTop: "20%"}}>
                                              <div className="modal-content">
                                                <div className="modal-body flex">
                                                  <input ref={"update_sub_name_"+x2.id} className="form-control" placeholder="輸入名稱" defaultValue={x2.name} />
                                                  <button onClick={()=>this.submitUpdate( 2, x2.id )} type="button" className="btn btn-primary" style={{marginLeft: "8px"}}>儲存</button>
                                                  <button type="button" className="btn btn-default" data-dismiss="modal" style={{marginLeft: "8px"}}>取消</button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
    }

    return render
  }

  renderSelectTheme( theme ) {

    let render = <Loader />

    if ( theme != undefined ) {

      render =  <select ref="select_theme" className="form-control" style={{marginBottom: "10px"}}>
                  { theme.result.map((x, y)=><option key={"option_"+y} value={x.id}>{x.name}</option>) }
                </select>
    }

    return render
  }

  submitAdd ( type ) {

    let cookie = this.state.cookie
    switch ( type ) {
      case 1:
        let add_name = this.refs.add_name.value
        console.log(add_name);
        this.props.dispatch( apiAddTheme( location.origin, cookie, add_name ) )
        break;
      case 2:
        let theme_id = this.refs.select_theme.value
        let add_sub_name = this.refs.add_sub_name.value
        console.log(theme_id);
        console.log(add_sub_name);
        this.props.dispatch( apiAddSubTheme( location.origin, cookie, theme_id, add_sub_name ) )
        break;
      default:
        console.log("null");
        break;
    }
  }

  submitUpdate ( type, id ) {

    let cookie = this.state.cookie
    switch ( type ) {
      case 1:
        let theme_id = id
        let update_name = this.refs['update_name_'+id].value
        console.log(update_name);
        this.props.dispatch( apiUpdateTheme( location.origin, cookie, theme_id, update_name ) )
        break;
      case 2:
        let sub_theme_id = id
        let update_sub_name = this.refs['update_sub_name_'+id].value
        console.log(update_sub_name);
        this.props.dispatch( apiUpdateSubTheme( location.origin, cookie, sub_theme_id, update_sub_name ) )
        break;
      default:
        console.log("null");
        break;
    }
  }

  submitDelete ( type, id ) {

    if ( confirm("確定刪除嗎?") ) {
      let cookie = this.state.cookie
      switch ( type ) {
        case 1:
          let theme_id = id
          console.log(theme_id);
          this.props.dispatch( apiDeleteTheme( location.origin, cookie, theme_id ) )
          break;
        case 2:
          let sub_theme_id = id
          console.log(sub_theme_id);
          this.props.dispatch( apiDeleteSubTheme( location.origin, cookie, sub_theme_id ) )
          break;
        default:
          console.log("null");
          break;
      }
    }
  }

  render () {

    // console.log(this.props);
    // console.log(this.state);
    const { theme } = this.props

    return (
      <div id="page-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="page-header">主題</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              { this.renderThemeList( theme ) }
            </div>
            <div className="col-lg-4">
              <h4>新增主題</h4>
              <div className="flex" style={{alignItems: "center"}}>
                <input ref="add_name" className="form-control" placeholder="輸入名稱" />
                <div onClick={()=>this.submitAdd( 1 )} className="btn btn-info btn-sm" style={{marginLeft: "10px"}}>新增</div>
              </div>
              <br />
              <hr size="2" />
              <h4>新增副主題</h4>
              { this.renderSelectTheme( theme ) }
              <div className="flex" style={{alignItems: "center"}}>
                <input ref="add_sub_name" className="form-control" placeholder="輸入名稱" />
                <div onClick={()=>this.submitAdd( 2 )} className="btn btn-info btn-sm" style={{marginLeft: "10px"}}>新增</div>
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
    theme: state.backend.theme,
    theme_action_status: state.backend.theme_action_status
  }
}

export default connect(mapStateToProps)(Theme)
