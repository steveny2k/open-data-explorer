import * as ActionTypes from '../actions'
import { updateObject, removeByKey, updateByKey } from './reducerUtilities'

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

function groupBy (state, action) {
  let groupKey = action.payload ? action.payload.value : null
  return updateObject(state, {
    groupBy: groupKey
  })
}

function addFilter (state, action) {
  return updateObject(state, {
    filters: {
      [action.key.value]: {}
    }
  })
}

function removeFilter (state, action) {
  return updateObject(state, {
    filters: removeByKey(state.filters, action.key)
  })
}

function updateFilter (state, action) {
  return updateObject(state, {
    filters: updateByKey(state.filters, action.key, action.options)
  })
}

export const queryReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_COLUMN: return updateQueryKeys(state, action)
    case ActionTypes.SUM_BY: return updateQueryKeys(state, action)
    case ActionTypes.GROUP_BY: return groupBy(state, action)
    case ActionTypes.CHANGE_DATEBY: return updateQueryKeys(state, action)
    case ActionTypes.ADD_FILTER: return addFilter(state, action)
    case ActionTypes.REMOVE_FILTER: return removeFilter(state, action)
    case ActionTypes.UPDATE_FILTER: return updateFilter(state, action)
    default:
      return state
  }
}
