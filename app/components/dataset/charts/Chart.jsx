require('c3/c3.css')

import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import C3Chart from './C3Chart'
import _ from 'lodash'

export default class Chart extends React.Component {
  constructor () {
    super()

    this._detectDataFormat = this._detectDataFormat.bind(this)
  }
  componentDidMount () {}

  _detectDataFormat (data) {
    if (Array.isArray(data[0])) return 'array'
    if (_.isPlainObject(data[0])) return 'object'
  }

  render () {
    let {chartDef, toggleYearMonth} = this.props
    let {data, type, title, order, dateBy, viewOption, fieldType} = chartDef
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
      stacked: false,
      onClick: function (d) {
        let categories = this.categories() // c3 function, get categorical labels
        console.log(d)
        console.log('you clicked {' + d.name + ': ' + categories[d.x] + ': ' + d.value + '}')
      }
    }

    if (fieldType === 'checkbox') {
      options.stacked = true
    }

    // adjust for array of arrays
    let labels = Array.isArray(data[0]) ? data[0] : data[0].values
    let dataType = this._detectDataFormat(data)

    var maxLabelLength = labels.reduce((prev, curr, idx, array) => {
      if (dataType === 'array') {
        return curr.length > prev ? curr.length : prev
      } else {
        if (!curr.label) {
          curr.label = 'Unknown'
        }
        return curr.label.length > prev ? curr.label.length : prev
      // return curr.value.length > prev.value.length ? curr.value.length : prev.value.length
      }
    }, 0)
    /*
    _.forEach(data[0].values, function (value, key) {
      if (!value.label) {
        value.label = 'Unknown'
      }
      maxLabelLength = value.label.length > maxLabelLength ? value.label.length : maxLabelLength
    })*/

    if (((data[0].values && data[0].values.length > 10) || (Array.isArray(data[0]) && data[0].length > 11)) && type === 'bar') {
      options.rotated = true
      options.padding.left = (maxLabelLength * 4) + 60
    }

    let toggle = <span/>
    if (fieldType === 'calendar_date') {
      options.timeseries = true
      let monthActive = dateBy === 'month' ? 'active' : ''
      let yearActive = dateBy === 'year' ? 'active' : ''
      toggle = (<ButtonGroup className='toggle-time'>
                  <Button
                    bsStyle="success"
                    bsSize="small"
                    onClick={toggleYearMonth}
                    className={monthActive}>
                    Month
                  </Button>
                  <Button
                    bsStyle="success"
                    bsSize="small"
                    onClick={toggleYearMonth}
                    className={yearActive}>
                    Year
                  </Button>
                </ButtonGroup>)
    }

    return (
    <div id="C3Chart">
      {toggle}
      <h2>{title}</h2>
      <C3Chart
        data={data}
        order={order}
        type={type}
        options={options}
        viewOption={viewOption}
        colors={this.props.colors} />
    </div>
    )
  }

}
