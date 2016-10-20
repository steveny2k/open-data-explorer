import { connect } from 'react-redux'
import { selectColumn, groupBy, sumBy, addFilter, applyChartType, removeFilter, applyFilter, updateFilter, changeDateBy } from '../actions'
import Charts from '../components/Chart/Charts'

const mapStateToProps = (state, ownProps) => {
  const { metadata } = state
  const { chartType, transformedChartData } = state.chart
  const { columns } = state.columnProps
  const { selectedColumn, groupBy, dateBy } = state.query
  return {
    metadata,
    chartProps: {
      chartType,
      chartData: transformedChartData,
      selectedColumn,
      groupBy,
      dateBy,
      columns
    }
  }
}

// Note: if we split up action creators, we can probably simplify the mapping, but for now this works
// https://github.com/reactjs/react-redux/blob/master/docs/api.md
// https://reactcommunity.org/redux/docs/api/bindActionCreators.html

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectColumn: (key) => {
      return dispatch(selectColumn(key))
    },
    handleGroupBy: (key) => {
      return dispatch(groupBy(key))
    },
    handleSumBy: (key) => {
      return dispatch(sumBy(key))
    },
    handleAddFilter: (key) => {
      return dispatch(addFilter(key))
    },
    handleRemoveFilter: (key) => {
      return dispatch(removeFilter(key))
    },
    applyFilter: (key, options) => {
      return dispatch(applyFilter(key, options))
    },
    updateFilter: (key, options) => {
      return dispatch(updateFilter(key, options))
    },
    changeDateBy: (dateBy) => {
      return dispatch(changeDateBy(dateBy))
    },
    applyChartType: (chartType) => {
      return dispatch(applyChartType(chartType))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Charts)
