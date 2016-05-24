import { METADATA_REQUEST, METADATA_SUCCESS, SELECT_COLUMN, COUNT_SUCCESS, MIGRATION_SUCCESS, COLPROPS_SUCCESS, DATA_SUCCESS, GROUP_BY, UPDATE_FILTER, ADD_FILTER, REMOVE_FILTER, APPLY_FILTER, CHANGE_DATEBY } from '../actions'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import merge from 'lodash/merge'
import union from 'lodash/union'
// import merge from 'lodash/merge'

function dataset (state = { columns: {}, query: {} }, action) {
  let copyState

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
    case METADATA_REQUEST:
      let freshState = {
        query: {
          isFetching: false,
          dateBy: 'year'
        },
        columns: {}
      }
      return merge({}, freshState)
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
    case CHANGE_DATEBY:
      return merge({}, state, {
        query: {
          dateBy: action.dateBy
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
      copyState = {...state}
      delete copyState.query.filters[action.key]
      return merge({}, state, copyState)
    case UPDATE_FILTER:
    case APPLY_FILTER:
      let updatedOptions = {
        query: {
          filters: {
            [action.key]: {
              options: action.options
            }
          }
        }
      }
      return merge({}, state, updatedOptions)
    default:
      return state
  }
}

const rootReducer = combineReducers({
  dataset,
  routing
})

export default rootReducer
