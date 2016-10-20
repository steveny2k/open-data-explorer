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

export const queryReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_COLUMN: return updateQueryKeys(state, action)
    case ActionTypes.SUM_BY: return updateQueryKeys(state, action)
    case ActionTypes.GROUP_BY: return updateQueryKeys(state, action)
    case ActionTypes.CHANGE_DATEBY: return updateQueryKeys(state, action)
    case ActionTypes.ADD_FILTER:
      return updateObject(state, {
        filters: {
          [action.key.value]: {}
        }
      })
    case ActionTypes.REMOVE_FILTER:
      return updateObject(state, {
        filters: removeByKey(state.filters, action.key)
      })
    case ActionTypes.UPDATE_FILTER:
      return updateObject(state, {
        filters: updateByKey(state.filters, action.key, action.options)
      })
    default:
      return state
  }
}
