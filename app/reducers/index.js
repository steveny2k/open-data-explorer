import { METADATA_SUCCESS, SELECT_COLUMN, COUNT_SUCCESS, MIGRATION_SUCCESS, COLPROPS_SUCCESS, DATA_SUCCESS, GROUP_BY, ADD_FILTER, REMOVE_FILTER } from '../actions'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import merge from 'lodash/merge'
import union from 'lodash/union'
// import merge from 'lodash/merge'

function dataset (state = { columns: {}, query: {} }, action) {
  if (action.response) {
    switch (action.type) {
      case COUNT_SUCCESS:
      case METADATA_SUCCESS:
      case MIGRATION_SUCCESS:
      case COLPROPS_SUCCESS:
        if (COLPROPS_SUCCESS) {
          action.response.categoryColumns = union(state.categoryColumns, action.response.categoryColumns)
        }
        return merge({}, state, action.response)
      case DATA_SUCCESS:
        let merged = merge({}, state, action.response)
        merged.query.data = action.response.query.data
        return Object.assign({}, state, merged)
      default:
        return state
    }
  }

  switch (action.type) {
    case SELECT_COLUMN:
      return merge({}, state, {
        query: {
          isFetching: true,
          selectedColumn: action.column
        }
      })
    case GROUP_BY:
      let groupKey = action.key ? action.key.value : null
      return merge({}, state, {
        query: {
          groupBy: groupKey
        }
      })
    case ADD_FILTER:
      return merge({}, state, {
        query: {
          filters: {
            [action.key.value]: {}
          }
        }
      })
    case REMOVE_FILTER:
      let copyState = {...state}
      delete copyState.query.filters[action.key]
      console.log(state)
      return merge({}, state, copyState)
    default:
      return state
  }
}

const rootReducer = combineReducers({
  dataset,
  routing
})

export default rootReducer
