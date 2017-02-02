import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { apiMemberSignIn } from '../../actions/member'
import styles from './Login.css'
import Loader from '../../components/Loader/Loader'
import { isEmpty, isEmail, isPassword } from '../../utils'

class Login extends Component {

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
    
    let member = nextProps.member
    if ( member.member_info.api_status == 1 ) {
      if ( member.member_status == 2 && member.member_info.permission_level >= 4 ) {
        this.props.router.push('/admin')
      }
      else {
        window.location.href = '/'
      }
    }
    else if ( member.member_info.api_status == 0 ) {
      alert( member.member_info.error_msg )
    }
  }

  componentDidMount () {
    // console.log('did');
    // this.props.dispatch( apiGetThemeList(location.origin) )
  }

  submit () {

    let email = this.refs.email.value
    let password = this.refs.password.value

    if( !isEmail(email) ) {
      alert("電子郵件格式不符")
    }
    else if( !isPassword(password) ) {
      alert("用戶密碼格式不符")
    }
    else {
      this.props.dispatch( apiMemberSignIn( location.origin, email, password ) )
    }
  }

  render () {

    console.log(this.props);

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="login-panel panel panel-default" style={{marginTop: "50%"}}>
              <div className="panel-heading">
                <h3 className="panel-title">Please Sign In</h3>
              </div>
              <div className="panel-body">
                <fieldset>
                  <div className="form-group">
                    <input className="form-control" placeholder="E-mail" ref="email" type="email" autoFocus />
                  </div>
                  <div className="form-group">
                    <input className="form-control" placeholder="Password" ref="password" type="password" />
                  </div>
                  <div onClick={()=>this.submit()} className="btn btn-lg btn-success btn-block">Login</div>
                </fieldset>
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
    member: state.member
  }
}

export default connect(mapStateToProps)(withRouter(Login))
