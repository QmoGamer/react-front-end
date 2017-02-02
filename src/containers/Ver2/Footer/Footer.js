import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Loader from '../../../components/Loader/Loader'
import ThemeList from '../../../components/Ver2/FooterItem/ThemeList'
import MemberItem from '../../../components/Ver2/FooterItem/MemberItem'
import styles from './Footer.css'

import { isEmpty } from '../../../utils'
const constants = require('../../../constants');

class Footer extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchTheme(url) )
  }

  constructor (props) {
    super(props)
    this.state = { loading: true }
  }

  componentDidUpdate () {

    const { theme } = this.props
    const { loading } = this.state

    if( !isEmpty( theme ) && loading == true ) {

      this.setState({ loading: false })
    }
  }

  render () {
    // console.log(this.props)
    const { theme, member } = this.props
    const { loading } = this.state
    let render_theme_list = <Loader />

    if ( loading == false ) {

      render_theme_list = <ThemeList theme={ theme.result } />
    }

    return (
      <footer>
        <div className={ styles.footer }>
          <div className={ styles.footer_menu }>
            <div onClick={ ()=> window.location.href="/" } className={ styles.home }>{ constants.VIEW_TEXT_COMMON_1 }</div>
            { render_theme_list }
            <MemberItem member={ member } />
          </div>
          <div className={ styles.copyright }>
            <div>{ constants.COPYRIGHT }</div>
            <div><img width="150px" src={ constants.VIEW_FOOTER_LOGO } /></div>
          </div>
        </div>
      </footer>
    )
  }
}

function mapStateToProps(state) {
  // console.log(state)
  return { 
    theme: state.home.theme,
    member: state.member
  }
}

export default connect(mapStateToProps)(Footer)