import * as ActionTypes from '../actions'
import { updateObject, removeByKey, updateByKey } from './reducerUtilities'

export const queryReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SELECT_COLUMN:
      return updateObject(state, {
        selectedColumn: action.column
      })
    case ActionTypes.SUM_BY:
      let sumKey = action.key ? action.key.value : null
      return updateObject(state, {
        sumBy: sumKey
      })
    case ActionTypes.GROUP_BY:
      let groupKey = action.key ? action.key.value : null
      return updateObject(state, {
        groupBy: groupKey
      })
    case ActionTypes.CHANGE_DATEBY:
      return updateObject(state, {
        dateBy: action.dateBy
      })
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
