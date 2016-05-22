require('c3/c3.css')

import React, { Component } from 'react'
import Chart from './C3Chart'
import { capitalize } from 'underscore.string'
import pluralize from 'pluralize'
import _ from 'lodash'

const colors = ['#a78ac6', '#04ae14', '#fb680e', '#fe32fe', '#a49659', '#ff5a8b', '#29a5ae', '#0eab6f', '#b479fc', '#de7b5c', '#89a004', '#3599fc', '#c68a13', '#f459c7', '#a99090', '#d47aa0', '#379fd4', '#76a080', '#77a250', '#fd634e', '#c579d6', '#8d8af4', '#df5ef5', '#8199ae', '#e37a31', '#40aa46', '#ea6f7b', '#c8884b', '#c18972', '#0fa98f', '#a4982b', '#fe43de', '#e06eb8', '#65a718', '#7994dd', '#b688a7', '#fd56a9', '#9b9779', '#ff5f6d', '#c88389', '#7d9c97', '#dd67de', '#5fa570', '#9292be', '#b79037', '#929c48', '#899d69', '#c57fb7', '#a985dd', '#e96c99', '#58a0b6', '#df7d02', '#f46d33', '#5ca297', '#9f91a7', '#ee6e65', '#d47f73', '#7da234', '#ec724d', '#54a857', '#2b9cec', '#b98e5a', '#d1842f', '#b4930e', '#af7fed', '#7298cd', '#db788a', '#18ac57', '#f447f6', '#cc855b', '#c773ed', '#4ea587', '#da7e4c', '#ff50b8', '#6a93f4', '#e06ac7', '#28a2c5', '#69a53d', '#ac9172', '#c98199', '#a78cb6']

// defaults

class ChartCanvas extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !_.isEqual(this.props.data, nextProps.data)
  }

  renderTitle (rowLabel, fieldName, groupName = null) {
    let title = pluralize(rowLabel) + ' by ' + fieldName
    return (<h2>{capitalize(title, true)}</h2>)
  }

  render () {
    // defaults
    let options = {
      padding: {
        top: 20,
        bottom: 20,
        left: 50,
        right: 10
      },
      grid: {
        x: false,
        y: true
      },
      timeseries: false,
      rotated: false,
      stacked: false,
      onClick: function (d) {
        let categories = this.categories() // c3 function, get categorical labels
        console.log(d)
        console.log(categories)
        console.log('you clicked {' + d.name + ': ' + categories[d.x] + ': ' + d.value + '}')
      }
    }
    let chartType = this.props.chartType || 'bar'
    let { rowLabel, selectedColumnDef, data } = this.props
    let type = selectedColumnDef.type
    let fieldName = selectedColumnDef.name
    let labels = Array.isArray(data[0]) ? data[0] : data[0].values

    let maxLabelLength = labels.reduce((prev, curr, idx, array) => {
      if (Array.isArray(data[0])) {
        return curr.length > prev ? curr.length : prev
      } else {
        if (!curr.label) {
          curr.label = 'Unknown'
        }
        return curr.label.length > prev ? curr.label.length : prev
      // return curr.value.length > prev.value.length ? curr.value.length : prev.value.length
      }
    }, 0)

    if (((data[0].values && data[0].values.length > 10) || (Array.isArray(data[0]) && data[0].length > 11)) && chartType === 'bar') {
      options.rotated = true
      options.padding.left = (maxLabelLength * 4) + 50
    }

    if (type === 'calendar_date') {
      options.timeseries = true
    } else if(type === 'checkbox') {
      options.stacked = true
    }

    return (
      <div id='C3Chart'>
        {/*toggle*/}
        {this.renderTitle(rowLabel, fieldName)}
        <Chart
          data={data}
          type={chartType}
          options={options}
          colors={colors} />
      </div>
    )
  }
}

export default ChartCanvas
