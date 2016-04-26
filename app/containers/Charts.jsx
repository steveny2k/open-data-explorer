import { connect } from 'react-redux'
import { selectColumn, groupBy, addFilter, removeFilter } from '../actions'
import Charts from '../components/Charts'

const mapStateToProps = (state, ownProps) => {
  const { dataset } = state
  return {
    dataset
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectColumn: (key) => {
      return dispatch(selectColumn(key))
    },
    handleGroupBy: (key) => {
      return dispatch(groupBy(key))
    },
    handleAddFilter: (key) => {
      return dispatch(addFilter(key))
    },
    handleRemoveFilter: (key) => {
      return dispatch(removeFilter(key))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Charts)
