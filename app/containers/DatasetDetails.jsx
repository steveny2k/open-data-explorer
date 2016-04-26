import { connect } from 'react-redux'
import DatasetDetails from '../components/DatasetDetails'

const mapStateToProps = (state, ownProps) => {
  const { dataset } = state
  return {
    dataset
  }
}

export default connect(mapStateToProps)(DatasetDetails)

