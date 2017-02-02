import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from './Blank.css'
// import { toggleSidebar } from '../../actions/toggleSidebar'
import { isEmpty } from '../../utils'
import Loader from '../../components/Loader/Loader'

class Blank extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {

  }

  componentWillUpdate () {

  }

  componentWillReceiveProps () {

  }

  componentDidMount () {

  }

  renderPage ( data ) {

    let render = <Loader />

    if( data != undefined ) {

    }

    return render
  }

  render() {
    // console.log(this.props);
    // const { news, news_total } = this.props

    return (
      <div>
       Blank
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state)
  return { 
    // toggleSidebar: state.toggleSidebar,
  }
}

export default connect(mapStateToProps)(Blank)