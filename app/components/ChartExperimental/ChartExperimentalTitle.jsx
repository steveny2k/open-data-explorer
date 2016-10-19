import React, { Component } from 'react'
import pluralize from 'pluralize'
import { toTitleCase } from '../../helpers'

class ChartExperimentalTitle extends Component {
  ///Builds the the chart title component for the chart

  buildA(sumBy,rowLabel){
    let a = pluralize(rowLabel)
    if (sumBy) {
      a = 'Sum of ' + columns[sumBy].name
    }
    return a
  }

  buildTitle(a,b, columns, groupBy){
    let title = a + ' by ' + b

    if (groupBy) {
      title += ' and ' + columns[groupBy].name
    }
    title = toTitleCase(title)
    return title
  }

  render () {
    let {columns, sumBy, rowLabel, groupBy, selectedColumnDef} = this.props
    let a = this.buildA(sumBy,rowLabel)
    let b = selectedColumnDef.name
    let title =  this.buildTitle(a,b, columns, groupBy)
    return (
        <h2 className={'chartTitle'}>{title}</h2>
    )
  }
}
export default ChartExperimentalTitle





