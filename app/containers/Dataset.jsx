import { connect } from 'react-redux'
import { loadMetadata, loadColumnProps, loadTable } from '../actions'
import Dataset from '../components/Dataset/Dataset'

const mapStateToProps = (state, ownProps) => {
  const { dataset } = state
  return {
    dataset
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
    loadTable: () => {
      return dispatch(loadTable())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dataset)
