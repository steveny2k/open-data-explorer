import { connect } from 'react-redux'
import Catalog from '../components/Catalog/Catalog'

const mapStateToProps = (state, ownProps) => {
  return {
    searchTerm: ownProps.location.query.search
  }
}

export default connect(
  mapStateToProps
)(Catalog)
