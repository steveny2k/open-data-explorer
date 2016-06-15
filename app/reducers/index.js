import { METADATA_REQUEST, METADATA_SUCCESS, SELECT_COLUMN, SORT_COLUMN, COUNT_SUCCESS, UPDATE_PAGE, LOAD_TABLE, MIGRATION_SUCCESS, COLPROPS_SUCCESS, DATA_SUCCESS, GROUP_BY, UPDATE_FILTER, ADD_FILTER, REMOVE_FILTER, APPLY_FILTER, CHANGE_DATEBY, SUM_BY } from '../actions'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import merge from 'lodash/merge'
import union from 'lodash/union'
import uniq from 'lodash/uniq'

function dataset (state = { columns: {}, query: {}, table: { tablePage: 0 } }, action) {
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
        if (action.response.query) {
          merged.query.data = action.response.query.data
        } else {
          merged.table.data = action.response.table.data
        }
        return Object.assign({}, state, merged)
      default:
        return state
    }
  }

  switch (action.type) {
    case LOAD_TABLE:
      return merge({}, state, {
        table: {
          tablePage: 0,
          isFetching: true
        }
      })
    case UPDATE_PAGE:
      return merge({}, state, {
        table: {
          tablePage: action.page
        }
      })
    case METADATA_REQUEST:
      let freshState = {
        query: {
          isFetching: false,
          dateBy: 'year'
        },
        columns: {}
      }
      return merge({}, freshState)
    case SORT_COLUMN:
      let updatedState = {
        table: {
          sorted: state.table.sorted ? uniq([action.key].concat(state.table.sorted)) : [action.key]
        },
        columns: {
          [action.key]: {
            sortDir: action.dir
          }
        }
      }
      return merge({}, state, updatedState)
    case SELECT_COLUMN:
      let updatedQuery = {
        query: {
          isFetching: true,
          selectedColumn: action.column
        }
      }
      if (state.query.groupBy === action.column) {
        updatedQuery.query.groupBy = null
      }
      return merge({}, state, updatedQuery)
    case GROUP_BY:
      let groupKey = action.key ? action.key.value : null
      return merge({}, state, {
        query: {
          groupBy: groupKey
        }
      })
    case SUM_BY:
      let sumKey = action.key ? action.key.value : null
      return merge({}, state, {
        query: {
          sumBy: sumKey
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
      let newOptions = action.options
      copyState = Object.assign({}, state)
      let existingOptions = copyState.query.filters[action.key].options || ''
      let isSelected = (newOptions.selected)
      let newState

      if (isSelected && Array.isArray(existingOptions.selected) &&
        (existingOptions.selected.length !== newOptions.selected.length || typeof newOptions.selected === 'string')) {
        copyState.query.filters[action.key].options.selected = action.options.selected
        newState = merge({}, copyState)
        console.log(copyState)
      } else {
        let updatedOptions = {
          query: {
            filters: {
              [action.key]: {
                options: action.options
              }
            }
          }
        }
        newState = merge({}, state, updatedOptions)
      }
      console.log(newState)
      return newState
    default:
      return state

  }
}

function messages (state = null, action) {
  return state
}

const rootReducer = combineReducers({
  dataset,
  messages,
  routing
})

export default rootReducer
