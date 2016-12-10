import { connect } from 'react-redux'
import DatasetDetails from '../components/Dataset/DatasetDetails'

const mapStateToProps = (state, ownProps) => {
  const { metadata } = state
  return {
    metadata
  }
}

export default connect(mapStateToProps)(DatasetDetails)

