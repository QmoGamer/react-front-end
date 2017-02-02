import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { apiMemberLoginCheck } from '../../actions/member'
import styles from './Nav.css'
import Loader from '../../components/Loader/Loader'
// import PackageItem from '../../components/PackageItem/PackageItem'
import { isEmpty } from '../../utils'

class Nav extends Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    // console.log('did');
    let cookie = window.sessionStorage.getItem('cookie')
    if( cookie == null ) {
      window.location.href = "/admin/login"
    }
    else {
      let member_cookie = window.sessionStorage.getItem('cookie')
      let token = window.sessionStorage.getItem('token')
      this.props.dispatch( apiMemberLoginCheck( location.origin, member_cookie, token ) )
    }
  }

  componentWillReceiveProps( nextProps ) {
    // console.log( nextProps.member );
    if( nextProps.member.member_info.permission_level < 4 ) {
      window.location.href = "/"
    }
  }

  render () {

    // const { npmPackage } = this.props
    // let loading = this.state.loading
    // let packageItem = loading ? null : <PackageItem item={npmPackage} />
    // let loader = loading ? <Loader /> : null

    return (
      <nav className="navbar navbar-default navbar-static-top" role="navigation" style={{marginBottom: "0"}}>
        <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/admin">Deta Admin Q</a>
        </div>

        <ul className="nav navbar-top-links navbar-right">
            <li className="dropdown">
                <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                    <i className="fa fa-user fa-fw"></i>
                    <i className="fa fa-caret-down"></i>
                </a>
                <ul className="dropdown-menu dropdown-user">
                    {
                      // <li><a href="#"><i className="fa fa-user fa-fw"></i> User Profile</a>
                      // </li>
                      // <li><a href="#"><i className="fa fa-gear fa-fw"></i> Settings</a>
                      // </li>
                      // <li className="divider"></li>
                    }
                    <li><a href="/admin/login"><i className="fa fa-sign-out fa-fw"></i> Logout</a>
                    </li>
                </ul>
            </li>
        </ul>

        <div className="navbar-default sidebar" role="navigation">
            <div className="sidebar-nav navbar-collapse">
                <ul className="nav" id="side-menu">
                    <li>
                      <a href="/admin" style={{ color: "#337ab7" }}><i className="fa fa-dashboard fa-fw"></i> Dashboard</a>
                    </li>
                    <li>
                      <a href="/admin/theme" style={{ color: "#337ab7" }}><i className="fa fa-dashboard fa-fw"></i> 主題</a>
                    </li>
                    <li>
                      <a href="/admin/news" style={{ color: "#337ab7" }}><i className="fa fa-dashboard fa-fw"></i> 新聞&公告</a>
                    </li>
                    <li>
                      <a href="/admin/articles" style={{ color: "#337ab7" }}><i className="fa fa-dashboard fa-fw"></i> 文章</a>
                    </li>
                </ul>
            </div>
        </div>

      </nav>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state);
  return {
    member: state.member
  }
}

export default connect(mapStateToProps)(Nav)
