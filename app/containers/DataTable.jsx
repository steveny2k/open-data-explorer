import { connect } from 'react-redux'
import { loadTable, sortColumn } from '../actions'
import DataTable from '../components/DataTable'

const mapStateToProps = (state, ownProps) => {
  const { dataset } = state
  return {
    dataset
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadTable: () => {
      return dispatch(loadTable())
    },
    sortColumn: (key, dir) => {
      return dispatch(sortColumn(key, dir))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataTable)
