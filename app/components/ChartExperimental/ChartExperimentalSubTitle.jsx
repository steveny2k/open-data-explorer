import React, { Component } from 'react'
import ChartColumns from './PanelColumns'
import { Col, Accordion } from 'react-bootstrap'
import pluralize from 'pluralize'


class ChartSubTitle extends Component {
  ///Builds the the chart sub title component for the chart

  buildSubTitle(filters, columns){
    let subtitle = ''
    if (!_.isEmpty(filters)) {
      subtitle = 'Only Showing '
      for (var key in filters) {
        if (filters[key].options && filters[key].options.selected) {
          subtitle += columns[key].name + ': '
          if (typeof filters[key].options.selected === 'string') {
            subtitle += filters[key].options.selected
          } else {
            subtitle += filters[key].options.selected.join(', ')
          }
    return subtitle
  }
  render () {
    let {filters, columns} = this.props
    let subtitle = this.buildSubTitle(filters,columns)
    return (
        <h3 className={'chartTitle'}>{subtitle}</h3>
    )

  }
}
export default ChartSubTitle


