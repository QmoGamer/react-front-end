import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Table, Column, Cell } from 'fixed-data-table';
import styles from './Articles.css'

import Loader from '../../components/Loader/Loader'
import { CheckCell, TextCell, LinkCell, IsDeleteCell } from '../../components/FixedDataTable/FixedDataTable'
import BtnPage from '../../components/BtnPage/BtnPage'

import { ver2_apiGetTheme, apiGetArticleList } from '../../actions/backend'
import { isEmpty, yyyymmdd } from '../../utils'

// const data = [
//   {article_id: 1, title: 'Rylan', theme_id: '1', 'theme_name': '技術交流', 'sub_theme_id': 1, 'sub_theme_name': '自動化設備', is_delete: 0},
//   {article_id: 2, title: 'Amelia', theme_id: '1', 'theme_name': '技術交流', 'sub_theme_id': 1, 'sub_theme_name': '自動化設備', is_delete: 0},
//   {article_id: 3, title: 'Estevan', theme_id: '1', 'theme_name': '技術交流', 'sub_theme_id': 1, 'sub_theme_name': '自動化設備', is_delete: 0},
//   {article_id: 4, title: 'Florence', theme_id: '1', 'theme_name': '技術交流', 'sub_theme_id': 1, 'sub_theme_name': '自動化設備', is_delete: 0},
//   {article_id: 5, title: 'Tressa', theme_id: '1', 'theme_name': '技術交流', 'sub_theme_id': 1, 'sub_theme_name': '自動化設備', is_delete: 1}
// ]
// let data_index = []
// for (var i = 0; i < data.length; i++) {
//   data_index.push(i);
// }

class DataListWrapper {
  constructor(indexMap, data) {
    this._indexMap = indexMap;
    this._data = data;
  }

  getSize() {
    return this._indexMap.length;
  }

  getObjectAt(index) {
    return this._data[ this._indexMap[index] ]
  }
}

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
      data_content: [],
      all_data_content: [],
      theme_id: 0,
      sub_theme_id: 0
    }
    this.allCheck = this.allCheck.bind(this);
    this.clearCheck = this.clearCheck.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.onThemeChange = this.onThemeChange.bind(this);
    this.onSubThemeChange = this.onSubThemeChange.bind(this);
    this.dispatchApi = this.dispatchApi.bind(this);
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
    this.dispatchApi( page )
  }

  componentWillReceiveProps ( nextProps ) {
    console.log(nextProps)
    console.log(this.props)
    if( nextProps.params.page != this.props.params.page ) {

      const { page } = nextProps.params
      const { theme_id, sub_theme_id } = this.state

      this.setState({ loading: true })
      this.dispatchApi( page, theme_id, sub_theme_id )
    }
  }

  componentDidUpdate () {

    const { loading, data, theme } = this.state

    if( !isEmpty( data ) && !isEmpty( theme ) && loading == true ) {

      this.setState({ loading: false })
    }
  }

  dispatchApi ( page, theme_id=0, sub_theme_id=0 ) {
    // console.log(theme_id)
    this.props.dispatch( apiGetArticleList( location.origin, page, theme_id, sub_theme_id ) )
      .then( res => {

        if( res.data.status == 1 ) {

          let data = res.data.result
          // console.log(data)
          let all_data_content = res.data.result.page_content
          let data_index = []
          for (var i = 0; i < all_data_content.length; i++) {
            data_index.push(i);
          }
          this.setState({ data: data, all_data_content: all_data_content, data_content: new DataListWrapper(data_index, all_data_content) })
        }
        else
          alert( res.data.error.error_msg )
      })
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

  _onFilterChange(e) {

    this.clearCheck()
    const { all_data_content } = this.state

    if (!e.target.value) {

      let data_index = []
      for (var i = 0; i < all_data_content.length; i++) {
        data_index.push(i);
      }
      this.setState({
        data_content: new DataListWrapper( data_index, all_data_content )
      })
    }
    else {

      let filterBy = e.target.value.toLowerCase();
      let size = all_data_content.length;
      let filteredIndexes = [];

      for (var index = 0; index < size; index++) {

        const {title, mainboard_name, subboard_name} = all_data_content[index];

        if (
          title.toLowerCase().indexOf(filterBy) !== -1 || 
          mainboard_name.toLowerCase().indexOf(filterBy) !== -1 || 
          subboard_name.toLowerCase().indexOf(filterBy) !== -1 
        ) {

          filteredIndexes.push(index);
        }
      }

      this.setState({
        data_content: new DataListWrapper(filteredIndexes, all_data_content),
      });
    }
  }

  onThemeChange ( event ) {
    // console.log( event.target.value )
    this.clearCheck()
    const { theme } = this.state
    const value = event.target.value

    value == 0 ? this.setState({ sub_theme: [], theme_id: 0 }) : theme.map((x, y)=> { if( x.id == value ) { this.setState({ loading: true, sub_theme: x.subboard, theme_id: value }) }})
    this.dispatchApi( 1, value, 0 )
  }

  onSubThemeChange ( event ) {
    // console.log( event.target.value )
    this.clearCheck()
    const value = event.target.value
    const { theme_id } = this.state

    value == 0 ? this.setState({ sub_theme_id: 0 }) : this.setState({ loading: true, sub_theme_id: value })
    this.dispatchApi( 1, theme_id, value )
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

  renderSubTheme ( data ) {

    // return <select onChange={this.subThemeChange} className={ styles.category + " form-control" } style={{ marginLeft: "10px" }}></select>
  }

  renderTable () {
    // console.log( this.state )
    const { data_content } = this.state

    return  <div className={ styles.table }>
              <Table
                rowsCount={data_content.getSize()}
                rowHeight={50}
                headerHeight={40}
                width={1000}
                height={600}>
                <Column
                  header={<Cell>ID</Cell>}
                  cell={
                    <CheckCell
                      data={ data_content }
                      field_id="article_id"
                    />
                  }
                  width={50}
                />
                <Column
                  header={<Cell>標題</Cell>}
                  cell={
                    <LinkCell
                      data={ data_content }
                      field="title"
                      field_id="article_id"
                    />
                  }
                  width={200}
                />
                <Column
                  header={<Cell>主分類</Cell>}
                  cell={
                    <TextCell
                      data={ data_content }
                      field="mainboard_name"
                      field_id="theme_id"
                    />
                  }
                  width={200}
                />
                <Column
                  header={<Cell>次分類</Cell>}
                  cell={
                    <TextCell
                      data={ data_content }
                      field="subboard_name"
                      field_id="sub_theme_id"
                    />
                  }
                  width={200}
                />
                <Column
                  header={<Cell>狀態</Cell>}
                  cell={
                    <IsDeleteCell
                      data={ data_content }
                      field="isdelete"
                    />
                  }
                  width={200}
                />
              </Table>
            </div>
  }

  renderPaging () {

    const { data } = this.state
    let path = '/admin/articles'

    return <BtnPage page={ parseInt( data.page ) } total_page={ parseInt( data.total_page ) } path={ path } />
  }

  render () {

    const { loading } = this.state;
    let render_table = <Loader />
    let render_theme = <Loader />
    let render_paging = <Loader />

    if( loading == false ) {

      render_table = this.renderTable()
      render_theme = this.renderTheme()
      render_paging = this.renderPaging()
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
                <div className="btn btn-success">移動</div>
                <div className="btn btn-danger" style={{ marginLeft: "10px" }}>刪除</div>
              </div>
            </div>
            { render_table }
          </div>
          { render_paging }
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
