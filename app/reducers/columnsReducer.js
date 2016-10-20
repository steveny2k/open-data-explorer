import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import union from 'lodash/union'
import { updateObject, createReducer } from './reducerUtilities'

// case reducers
function initColumns (state, action) {
  return updateObject(state, {
    columns: action.response.columns
  })
}

function loadColumnProperties (state, action) {
  action.response.categoryColumns = union([], state.categoryColumns, action.response.categoryColumns)
  return merge({}, state, action.response)
}

export const columnsReducer = createReducer({}, {
  [ActionTypes.METADATA_SUCCESS]: initColumns,
  [ActionTypes.COLPROPS_SUCCESS]: loadColumnProperties
})

/*
export const columnsReducer = (state = {}, action) => {
  if (action.response) {
    switch (action.type) {
      case ActionTypes.METADATA_SUCCESS: return initColumns(state, action)
      case ActionTypes.COLPROPS_SUCCESS: return loadColumnProperties(state, action)
      default:
        return state
    }
  } else {
    return state
  }
}
*/

