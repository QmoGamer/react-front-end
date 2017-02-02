import React from 'react'
import { connect } from 'react-redux'
import Nav from './Nav/Nav'
// import Header from './Header/Header'
// import Sidebar from './Sidebar/Sidebar'
// import Nav from '../containers/Nav/Nav'
// import Footer from '../containers/Footer/Footer'

// /* generic styles */
// import styles from '../styles/base.css'
// import normalize from '../styles/normalize.css'
// Object.assign(styles, normalize)

function Backend({ pushPath, children }) {
  return (
    <div id="wrapper">

      <Nav />

      <div>      
        {children}
      </div>

    </div>

  );
};

module.exports = connect(
  null
)(Backend)