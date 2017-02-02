import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
// import { fetchPackage } from '../../actions/npmPackage'
import styles from './Index.css'
import Loader from '../../components/Loader/Loader'
// import PackageItem from '../../components/PackageItem/PackageItem'
import { isEmpty } from '../../utils'

class Index extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    // this.setState({
    //   loading: true
    // })
  }

  componentWillReceiveProps (nextProps) {
    // this.setState({
    //   loading: !isEmpty(nextProps.params.npmPackage)
    // })
  }

  componentDidMount () {
    // console.log('did');
    // this.props.dispatch(fetchPackage(location.origin, this.props.params.name))
  }

  render () {

    // const { npmPackage } = this.props
    // let loading = this.state.loading
    // let packageItem = loading ? null : <PackageItem item={npmPackage} />
    // let loader = loading ? <Loader /> : null

    return (
       <div id="page-wrapper">
          <div className="container-fluid">
              <div className="row">
                  <div className="col-lg-12">
                    <div className="panel-body">
                      <h3>Index</h3>
                      <ol>
                        <a href="/admin/theme"><li style={{ listStyle: "inherit" }}>主題設定</li></a>
                        <a href="/admin/news"><li style={{ listStyle: "inherit" }}>新聞與公告</li></a>
                        <a href="/admin/articles"><li style={{ listStyle: "inherit" }}>文章列表</li></a>
                      </ol>
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
    // npmPackage: state.npmPackage
  }
}

export default connect(mapStateToProps)(Index)
