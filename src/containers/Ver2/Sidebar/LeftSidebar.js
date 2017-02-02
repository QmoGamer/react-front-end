import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Loader from '../../../components/Loader/Loader'
import Ad from '../../../components/Ad/Ad'

import styles from './LeftSidebar.css'
const constants = require('../../../constants');

//temp
let json = [
  {
    "id": "1",
    "path": "/public/ad/ad109.png"
  },
  {
    "id": "2",
    "path": "/public/ad/ad110.png"
  },
  {
    "id": "3",
    "path": "/public/ad/ad111.png"
  },
  {
    "id": "1",
    "path": "/public/ad/ad112.png"
  },
  {
    "id": "2",
    "path": "/public/ad/ad108.png"
  },
  {
    "id": "3",
    "path": "/public/ad/ad107.png"
  },
  {
    "id": "1",
    "path": "/public/ad/ad102.png"
  },
  {
    "id": "2",
    "path": "/public/ad/ad110.png"
  },
  {
    "id": "3",
    "path": "/public/ad/ad100.png"
  },
  {
    "id": "1",
    "path": "/public/ad/ad112.png"
  }
]

class LeftSidebar extends Component {

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

  // closeSidebar() {
  //   this.props.dispatch( closeSidebar() )
  // }

  // renderMy (member) {

  //   let render = null
  //   if( member != undefined )
  //     if ( member.member_status == 2 )
  //       render = <Link to="/my/post/1"><li><IconTitle icon_classname="fa fa-home" title="我的" /></li></Link>

  //   return render
  // }

  // renderTheme (theme) {

  //   let render = <Loader />
  //   if( theme != undefined )
  //     render = theme.result.map((x, y)=><Link key={"menu"+y} to={"/theme/"+x.id}><li><IconTitle icon_classname="fa fa-home" title={x.name} /></li></Link>)

  //   return render
  // }

  render () {
    // console.log("render_side");
    // const { toggleSidebar, theme, member } = this.props

    // let toggle = toggleSidebar.toggle
    // let css_sidebar = toggle ? "sidebar_open" : "sidebar_close"
    let side_ad = json.map((x, y)=><div key={"ad"+y} style={{margin: "4px 0"}}><Ad path={x.path} /></div>)

    // //my
    // let css_my = null
    // if ( member != undefined )
    //   if ( member.member_status == 2 )
    //     css_my = 'my'

    return (
      <div className={styles.left_sidebar}>
        { side_ad }
      </div>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state)
  return { 
    // toggleSidebar: state.toggleSidebar,
    // theme: state.home.theme,
    // member: state.member
  }
}

export default connect(mapStateToProps)(LeftSidebar)