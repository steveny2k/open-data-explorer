import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getSelectedColumnDef } from '../reducers'
import { loadMetadata, loadColumnProps, loadQueryStateFromString } from '../actions'
import ChartExperimentalCanvas from '../components/ChartExperimental/ChartExperimentalCanvas'
import ChartExperimentalTitle from '../components/ChartExperimental/ChartExperimentalTitle'
import ChartExperimentalSubTitle from '../components/ChartExperimental/ChartExperimentalSubTitle'
import Loading from '../components/Loading'

class Embed extends Component {
  componentWillMount () {
    let { queryString, onLoad, loadColumnProps, loadQueryStateFromString } = this.props

    onLoad()
      .then(() => {
        loadColumnProps()
      })
      .then(() => {
        setTimeout(() => {
          loadQueryStateFromString(queryString)
        }, 1000)
      })
  }

  render () {
    let { columns, rowLabel, isFetching, selectedColumnDef, groupBy, sumBy, filters } = this.props
    let { chartData, chartType, groupKeys } = this.props
    console.log()
    return (
      <div className='Embed'>
        <Loading isFetching={isFetching} style='centered'>
          <div className='chartHeader'>
            <ChartExperimentalTitle
              columns={columns}
              rowLabel={rowLabel}
              selectedColumnDef={selectedColumnDef}
              groupBy={groupBy}
              sumBy={sumBy} />
            <ChartExperimentalSubTitle columns={columns} filters={filters} />
          </div>
          <ChartExperimentalCanvas
            embed
            chartData={chartData}
            chartType={chartType}
            groupKeys={groupKeys}
            columns={columns}
            filters={filters}
            rowLabel={rowLabel}
            selectedColumnDef={selectedColumnDef}
            groupBy={groupBy}
            sumBy={sumBy} />
        </Loading>
      </div>
    )
  }
}

Embed.propTypes = {
  id: PropTypes.string,
  queryString: PropTypes.string,
  onLoad: PropTypes.func,
  loadColumnProps: PropTypes.func,
  loadQueryStateFromString: PropTypes.func
}

Embed.defaultProps = {
  isFetching: true
}

const mapStateToProps = (state, ownProps) => {
  const { query, columnProps, chart, metadata } = state

  return {
    id: ownProps.params.id,
    queryString: ownProps.location.query.q,
    chartType: chart.chartType,
    chartData: chart.chartData,
    groupKeys: chart.groupKeys,
    selectedColumn: query.selectedColumn,
    selectedColumnDef: getSelectedColumnDef(state),
    columns: columnProps.columns,
    groupBy: query.groupBy,
    sumBy: query.sumBy,
    dateBy: query.dateBy,
    filters: query.filters,
    rowLabel: metadata.rowLabel,
    isFetching: query.isFetching
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLoad: () => {
      return dispatch(loadMetadata(ownProps.params.id))
    },
    loadColumnProps: () => {
      return dispatch(loadColumnProps())
    },
    loadQueryStateFromString: (q) => {
      return dispatch(loadQueryStateFromString(q))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)(Embed)
