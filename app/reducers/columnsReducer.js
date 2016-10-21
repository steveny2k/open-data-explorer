import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import union from 'lodash/union'
import { updateObject, createReducer } from './reducerUtilities'

// selectors
export const getColumnDef = (state, column) =>
  state && state.columns ? state.columns[column] : null

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

const columnsReducer = createReducer({}, {
  [ActionTypes.METADATA_SUCCESS]: initColumns,
  [ActionTypes.COLPROPS_SUCCESS]: loadColumnProperties
})

export default columnsReducer
