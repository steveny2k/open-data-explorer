require('./daterangepicker.scss')

import React from 'react'
import {Button, Glyphicon} from 'react-bootstrap'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import moment from 'moment'
//to address bug with jQuery dependency on datepicker https://github.com/skratchdot/react-bootstrap-daterangepicker/issues/60
global.jQuery = require('jquery')

const ranges = {
  'year': {
    'Last 3 Years' : [moment().subtract(3,'years').startOf('year'), moment()],
    'Last 5 Years' : [moment().subtract(5,'years').startOf('year'), moment()],
    'Last 10 Years' : [moment().subtract(10,'years').startOf('year'), moment()],
    'Last 90 days': [moment().subtract(89, 'days'), moment()],
    'Last 180 days': [moment().subtract(179, 'days'), moment()],
    'This Quarter': [moment().startOf('quarter'), moment().endOf('quarter')],
    'Last Quarter': [moment().subtract(1, 'quarter').startOf('quarter'), moment().subtract(1, 'quarter').endOf('quarter')],
    'This Year': [moment().startOf('year'), moment()],
    'Last Year': [moment().subtract(1,'year').startOf('year'), moment().subtract(1,'year').endOf('year')]
  },
  'month': {
    'Last 90 days': [moment().subtract(89, 'days'), moment()],
    'Last 180 days': [moment().subtract(179, 'days'), moment()],
    'This Quarter': [moment().startOf('quarter'), moment().endOf('quarter')],
    'Last Quarter': [moment().subtract(1, 'quarter').startOf('quarter'), moment().subtract(1, 'quarter').endOf('quarter')],
    'This Year': [moment().startOf('year'), moment()],
    'Last Year': [moment().subtract(1,'year').startOf('year'), moment().subtract(1,'year').endOf('year')]
  },
  'day': {
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'Last 90 days': [moment().subtract(89, 'days'), moment()],
    'Last 180 days': [moment().subtract(179, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
}

export default class FilterDateTime extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      startDate: moment().subtract(29, 'days'),
      endDate: moment()
    }

    this.onFilter = this.onFilter.bind(this)
  }

  onFilter(ev, picker) {
    if(picker.oldStartDate.format('YYYY-MM-DD') !== picker.startDate.format('YYYY-MM-DD') || picker.oldEndDate.format('YYYY-MM-DD') !== picker.endDate.format('YYYY-MM-DD')) {
      let options = {
        startDate: picker.startDate,
        endDate: picker.endDate,
        key: this.props.fieldKey
      }
      options.startDate = picker.startDate
      options.endDate = picker.endDate
      options.key = this.props.fieldKey
      this.props.onFilter(options)
    }
  }

  render() {
    let start = this.props.startDate.format('MM/DD/YYYY'),
      end = this.props.endDate.format('MM/DD/YYYY'),
      label = start + ' to ' + end,
      r = ranges[this.props.dateBy]
    if (start === end) {
      label = start;
    }
    return(
      <DateRangePicker startDate={this.props.startDate} endDate={this.props.endDate} ranges={ranges.year} onEvent={this.onFilter} opens="left">
      <Button className="selected-date-range-btn" style={{width:'100%'}}>
        <div className="pull-left"><Glyphicon glyph="calendar" /></div>
        <div className="pull-right">
          <span>
            {label}&nbsp;
          </span>
          <span className="caret"></span>
        </div>
      </Button>
    </DateRangePicker>
      )
    
  }
}