import * as ActionTypes from '../actions'
import { updateObject, removeByKey, updateByKey } from './reducerUtilities'

const initialState = {}

const keyMap = {
  [ActionTypes.SUM_BY]: 'sumBy',
  [ActionTypes.GROUP_BY]: 'groupBy',
  [ActionTypes.CHANGE_DATEBY]: 'dateBy',
  [ActionTypes.SELECT_COLUMN]: 'selectedColumn'
}

function updateQueryKeys (state, action) {
  return updateObject(state, {
    [keyMap[action.type]]: action.payload
  })
}

function selectColumn (state, action) {
  return updateObject(state, {
    selectedColumn: action.payload
  })
}

function dataRequest (state, action) {
  return updateObject(state, {
    isFetching: true
  })
}

function setFetchingFalse (state, action) {
  return updateObject(state, {
    isFetching: false
  })
}

function sumBy (state, action) {
  let sumKey = action.payload ? action.payload.value : null
  return updateObject(state, {
    sumBy: sumKey
  })
}

function groupBy (state, action) {
  let groupKey = action.payload ? action.payload.value : null
  return updateObject(state, {
    groupBy: groupKey
  })
}

function addFilter (state, action) {
  return updateObject(state, {
    filters: {
      [action.payload.value]: {}
    }
  })
}

function removeFilter (state, action) {
  return updateObject(state, {
    filters: removeByKey(state.filters, action.payload)
  })
}

function updateFilter (state, action) {
  return updateObject(state, {
    filters: updateByKey(state.filters, action.payload.key, action.payload)
  })
}

function resetState (state, action) {
  return initialState
}

function updateFromQueryString (state, action) {
  return updateObject(state, action.payload)
}

export const queryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.METADATA_REQUEST: return resetState(state, action)
    case ActionTypes.SELECT_COLUMN: return selectColumn(state, action)
    case ActionTypes.DATA_REQUEST: return dataRequest(state, action)
    case ActionTypes.DATA_SUCCESS:
    case ActionTypes.DATA_FAILURE:
    case ActionTypes.QS_ERROR: return setFetchingFalse(state, action)
    case ActionTypes.SUM_BY: return sumBy(state, action)
    case ActionTypes.GROUP_BY: return groupBy(state, action)
    case ActionTypes.CHANGE_DATEBY: return updateQueryKeys(state, action)
    case ActionTypes.ADD_FILTER: return addFilter(state, action)
    case ActionTypes.REMOVE_FILTER: return removeFilter(state, action)
    case ActionTypes.UPDATE_FILTER: return updateFilter(state, action)
    case ActionTypes.UPDATE_FROM_QS: return updateFromQueryString(state, action)
    default:
      return state
  }
}
