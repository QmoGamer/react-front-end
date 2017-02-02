import React, { Component, PropTypes } from 'react'
const constants = require('../../constants')

export default class ServerError extends Component {

  constructor (props) {
    super(props)
  }

  render () {

    return (
      <div style={{padding: '0 20px'}}>
        <h1>ServerError !</h1>
      </div>
    )
  }
}
