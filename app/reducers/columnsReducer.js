import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import union from 'lodash/union'
import { updateObject } from './reducerUtilities'

export const columnsReducer = (state = {}, action) => {
  if (action.response) {
    switch (action.type) {
      case ActionTypes.METADATA_SUCCESS:
        return updateObject(state, {
          columns: action.response.columns
        })
      case ActionTypes.COLPROPS_SUCCESS:
        if (ActionTypes.COLPROPS_SUCCESS) {
          action.response.categoryColumns = union([], state.categoryColumns, action.response.categoryColumns)
        }
        return merge({}, state, action.response)
      default:
        return state
    }
  } else {
    return state
  }
}
