import { connect } from 'react-redux'
import DatasetOverview from '../components/Dataset/DatasetOverview'

const mapStateToProps = (state, ownProps) => {
  const { dataset } = state
  return {
    dataset
  }
}

export default connect(mapStateToProps)(DatasetOverview)
