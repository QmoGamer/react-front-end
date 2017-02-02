import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Loader from '../../../components/Loader/Loader'
import News from '../../../components/Ver2/Home/News'
import Announcement from '../../../components/Ver2/Home/Announcement'

import styles from './Home.css'
import { apiGetHomeNews, apiGetHomeAnnouncement } from '../../../actions/home'
import { isEmpty } from '../../../utils'
const constants = require('../../../constants')

class Topic extends Component {

  static fetchData({ params, store, url }) {
    // return store.dispatch( fetchPackage(url, params.name) )
  }

  constructor (props) {
    super(props)
    this.state = { 
      data: [],
      tab: 'news', 
      is_enable: true,
      loading: true
    }
  }

  componentDidMount () {

    const { tab } = this.state

    this.dispatchTopic( tab )
  }
  
  componentDidUpdate (prevProps, prevState) {
  
    const { data, loading } = this.state

    if( !isEmpty( data ) && loading == true ) {
      this.setState({ loading: false })
    }
  }

  dispatchTopic ( tab ) {
    // console.log( tab, sub_theme_id, page );

    if ( tab == 'news' ) {
      this.props.dispatch( apiGetHomeNews( location.origin ) )
        .then( res => this.handleApiResult( res ) )
    }
    else if ( tab == 'announcement' ) {
      this.props.dispatch( apiGetHomeAnnouncement( location.origin ) )
        .then( res => this.handleApiResult( res ) )
    }
  }

  handleApiResult ( res ) {
    // console.log( res )
    if( res.data.status == 1 ) {

      this.setState({ data: res.data.result })
    }
    else 
      alert( res.data.error.error_msg )
  }

  onChangeTab ( tab ) {

    const { is_enable } = this.state

    if ( is_enable == true ) {

      this.setState({ tab: tab, data: [], loading: true, is_enable: false })
      this.dispatchTopic( tab )
      setTimeout( function(){ this.setState({ is_enable: true }) }.bind(this), 1000 )
    }
  }

  render () {
    // console.log( this.state )
    const { tab, loading, data } = this.state
    let render_panel = <Loader />

    if( loading == false ) {

      if ( tab == 'news' ) {
        render_panel = <News data={ data } />
      }
      else if ( tab == 'announcement' ) {
        render_panel = <Announcement data={ data } />
      }
    }

    return (
      <div className={styles.topic}>
        <div className={styles.tabs}>
          <div className={ tab == "news" ? styles.active : null } onClick={ ()=> this.onChangeTab("news") }>新聞</div>
          <div className={ tab == "announcement" ? styles.active : null } onClick={ ()=> this.onChangeTab("announcement") }>公告</div>
        </div>
        { render_panel }
      </div>
    )
  }
}

export default connect()(Topic)
