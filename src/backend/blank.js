import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
// import { fetchPackage } from '../../actions/npmPackage'
// import styles from './Index.css'
import Loader from '../../components/Loader/Loader'
// import PackageItem from '../../components/PackageItem/PackageItem'
import { isEmpty } from '../../utils'

class Blank extends Component {

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
                      <h1 className="page-header">Blank</h1>
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

export default connect(mapStateToProps)(Blank)
