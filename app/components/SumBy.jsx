require('react-select/dist/react-select.css')

import React, { Component } from 'react'
import Select from 'react-select'


class SumBy extends Component {
  constructor (props) {
    super(props)
    this.renderSumList = this.renderSumList.bind(this)
  }
