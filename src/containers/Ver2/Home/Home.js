import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Topic from './Topic'
import HomeTheme from '../ThemePanel/HomeTheme'
import Loader from '../../../components/Loader/Loader'
import IconTitle from '../../../components/IconTitle/IconTitle'

import styles from './Home.css'
import { isEmpty } from '../../../utils'
const constants = require('../../../constants');

class Home extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchNews(url) )
    //             .then( store.dispatch( fetchAnnouncement(url) ) )
  }

  constructor (props) {
    super(props)
    // this.changeTab = this.changeTab.bind(this)
  }

  render () {

    return (
      <div className={ styles.home }>
        <div className={ styles.title }><IconTitle title="首頁" color="#9e9e9e" /></div>
        <Topic />
        <HomeTheme />
      </div>
    )
  }
}

function mapStateToProps(state) {

  return {
    // member: state.member,
  }
}

export default connect(mapStateToProps)(Home)
