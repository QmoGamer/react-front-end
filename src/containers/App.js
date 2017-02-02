import React from 'react'
// import { Link } from 'react-router'
import { connect } from 'react-redux'
import Header from './Ver2/Header/Header'
import LeftSidebar from './Ver2/Sidebar/LeftSidebar'
import RightSidebar from './Ver2/Sidebar/RightSidebar'
import Footer from './Ver2/Footer/Footer'
// import Nav from '../containers/Nav/Nav'

/* generic styles */
import styles from '../styles/base.css'
import normalize from '../styles/normalize.css'
Object.assign(styles, normalize)

// 
function App({ pushPath, children }) {
  // console.log(children.props.location.pathname);
  return (
    <div className="wrapper">

      <Header path={ children.props.location.pathname } />

      <div className="app">
        
        <LeftSidebar />

        <main>      
          {children}
        </main>

        <RightSidebar />

      </div>

      <Footer />

    </div>

  );
};

module.exports = connect(
  null
)(App)