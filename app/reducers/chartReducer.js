import * as ActionTypes from '../actions'
import { updateObject, createReducer } from './reducerUtilities'

// case reducers
function updateData (state, action) {
  if (action.response.query) {
    return updateObject(state, {
      chartData: action.response.query.originalData,
      transformedChartData: action.response.query.data,
      isFetching: false
    })
  } else {
    return state
  }
}

function changeChartType (state, action) {
  return updateObject(state, {
    chartType: action.chartType
  })
}

// slice reducer - chart
export const chartReducer = createReducer({}, {
  [ActionTypes.DATA_SUCCESS]: updateData,
  [ActionTypes.APPLY_CHART_TYPE]: changeChartType
})
