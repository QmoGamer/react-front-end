import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Loader from '../../../components/Loader/Loader'
import Ad from '../../../components/Ad/Ad'

import styles from './RightSidebar.css'
const constants = require('../../../constants');

//temp
let json = [
  {
    "id": "1",
    "path": "/public/ad/ad100.png"
  },
  {
    "id": "2",
    "path": "/public/ad/ad101.png"
  },
  {
    "id": "3",
    "path": "/public/ad/ad102.png"
  },
  {
    "id": "1",
    "path": "/public/ad/ad103.png"
  },
  {
    "id": "2",
    "path": "/public/ad/ad104.png"
  },
  {
    "id": "3",
    "path": "/public/ad/ad105.png"
  },
  {
    "id": "1",
    "path": "/public/ad/ad101.png"
  },
  {
    "id": "2",
    "path": "/public/ad/ad107.png"
  },
  {
    "id": "3",
    "path": "/public/ad/ad108.png"
  },
  {
    "id": "1",
    "path": "/public/ad/ad100.png"
  }
]

class RightSidebar extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchTheme(url) )
  }

	constructor (props) {
    super(props)
    // this.closeSidebar = this.closeSidebar.bind(this)
  }

  componentDidMount() {
    // let bool = document.documentElement.clientWidth < 768 ? false : true
    // this.props.dispatch( toggleSidebar(bool) )
    // this.props.dispatch( fetchTheme(location.origin) )
  }

  render () {
    // console.log("render_side");
    // const { toggleSidebar, theme, member } = this.props

    let side_ad = json.map((x, y)=><div key={"ad"+y} style={{margin: "4px 0"}}><Ad path={x.path} /></div>)

    return (
      <div className={styles.right_sidebar}>
        { side_ad }
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state)
  return { 

  }
}

export default connect(mapStateToProps)(RightSidebar)