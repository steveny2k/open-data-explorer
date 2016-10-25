import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import union from 'lodash/union'
import { updateObject, createReducer } from './reducerUtilities'

// selectors
export const getColumnDef = (state, column) =>
  state && state.columns ? state.columns[column] : null

// refactor this to pass in a filter callback to a single column filtering function
export const getGroupableColumns = (state, selectedColumn) => {
  let { columns } = state
  selectedColumn = selectedColumn || ''
  if (!columns) return []

  return Object.keys(columns).filter((col) => {
    return (columns[col].key !== selectedColumn && columns[col].categories)
  }).map((col) => {
    return {label: columns[col].name, value: columns[col].key}
  })
}

export const getSelectableColumns = (state) => {
  let { columns } = state
  let colTypesAccepted = ['number', 'checkbox', 'date']

  if (!columns) return []

  return Object.keys(columns).filter((col) => {
    return (columns[col].categories || colTypesAccepted.indexOf(columns[col].type))
  }).map((col) => {
    return {label: columns[col].name, value: columns[col].key, type: columns[col].type}
  })
}

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
