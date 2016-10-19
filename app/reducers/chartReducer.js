import * as ActionTypes from '../actions'
import { updateObject, removeByKey, updateByKey } from './reducerUtilities'
import merge from 'lodash/merge'

export const chartReducer = (state = {}, action) => {
  if (action.response) {
    switch (action.type) {
      case ActionTypes.DATA_SUCCESS:
        if (action.response.query) {
          return Object.assign({}, state, {
            chartData: action.response.query.originalData,
            isFetching: false
          })
        } else {
          return state
        }
      default:
        return state
    }
  }
  switch (action.type) {
    // remove
    case ActionTypes.CHANGE_DATEBY:
      return merge({}, state, {
        dateBy: action.dateBy
      })
    // remove
    case ActionTypes.GROUP_BY:
      let groupKey = action.key ? action.key.value : null
      return merge({}, state, {
        groupBy: groupKey
      })
    // remove
    case ActionTypes.SELECT_COLUMN:
      return merge({}, state, {
        selectedColumn: action.column,
        isFetching: true
      })
    case ActionTypes.APPLY_CHART_TYPE:
      return merge({}, state, {
        chartType: action.chartType
      })
    // change dimensions
    default:
      return state
  }
}
